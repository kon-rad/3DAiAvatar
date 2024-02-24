import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

if (!process.env.MONGODB_ATLAS_URI) {
  throw new Error("Missing Mongodb MONGODB_ATLAS_URI in .env file");
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { fileUrl, fileName, avatarId } = requestBody;
  const aiCloneId = requestBody.aiCloneId || "";

  console.log(
    "api/write/pdf endpoint userId fileUrl, fileName: ",
    fileUrl,
    fileName
  );

  const newDocUpload = {
    fileName,
    fileUrl,
    aiCloneId,
  };

  try {
    /* load from remote pdf URL */
    const response = await fetch(fileUrl);
    const buffer = await response.blob();
    const loader = new PDFLoader(buffer);
    const rawDocs = await loader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log("creating vector store... docs:", docs);
    const docsWithMetaData = docs.map((d: any) => {
      console.log("d: ", d);
      return {
        ...d,
        metadata: {
          ...(d.metadata || {}),
          avatarId: avatarId,
          fileName: fileName,
          fileUrl: fileUrl,
        },
      };
    });
    console.log("docsWithMetaData: ", docsWithMetaData);

    const embeddings = new OpenAIEmbeddings();
    // const embeddings = new TogetherAIEmbeddings({
    //   apiKey: process.env.TOGETHER_AI_API_KEY,
    //   modelName: "togethercomputer/m2-bert-80M-8k-retrieval",
    // });

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");

    const namespace = "aiclone.documents";
    const [dbName, collectionName] = namespace.split(".");
    const collection = client.db(dbName).collection(collectionName);

    // make a langchain db vector search on collection

    const mongoDBAtlasVectorSearch = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "default",
      textKey: "text",
      embeddingKey: "embedding",
      // indexName: "default", // The name of the Atlas search index. Defaults to "default"
      // textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
      // embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
      // https://js.langchain.com/docs/integrations/vectorstores/mongodb_atlas
    });
    console.log("docsWithMetaData: ", docsWithMetaData);
    console.log("docsWithMetaData length: ", docsWithMetaData.length);
    console.log(
      "docsWithMetaData last: ",
      docsWithMetaData[docsWithMetaData.length - 1]
    );

    try {
      const iResponse = await mongoDBAtlasVectorSearch.addDocuments(
        docsWithMetaData
      );
      console.log("iResponse: ", iResponse);
    } catch (e) {
      throw new Error(e);
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }

  return NextResponse.json({
    text: "Successfully embedded pdf",
    id: fileName,
  });
}
