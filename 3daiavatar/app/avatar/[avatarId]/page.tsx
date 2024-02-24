"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useState, ChangeEvent, useEffect, useTransition } from "react";
import { useS3Upload } from "next-s3-upload";
import { FileDrop } from "@/components/FileDrop";

interface Avatar {
  name: string;
  id: number;
}

const AvatarPage: React.FC = () => {
  // const pathname = usePathname();

  const [avatarDetails, setAvatarDetails] = useState<any[]>([]);
  const [avatarDocs, setAvatarDocs] = useState<any[]>([]);

  const [avatarName, setAvatarName] = useState<string>("");
  const [readerFileName, setReaderFileName] = useState<string>("");
  const [readerFileUrl, setReaderFileUrl] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  let [uploading, setUploading] = useTransition();
  const pathname = usePathname();

  let { uploadToS3 } = useS3Upload();
  const [file, setFile] = useState<File | null>(null);

  // const avatarId = searchParams.get("avatarId");

  const avatarId = pathname.split("/").pop();
  console.log("avatarId: ", avatarId);

  const getAvatarDetails = async () => {
    const avatarDetails = await axios.get(`/api/avatar/${avatarId}`);
    console.log("avatarDetails: ", avatarDetails);
    setAvatarDetails(avatarDetails?.data);
    setAvatarName(avatarDetails?.data?.name);
    setSystemPrompt(avatarDetails?.data?.description);
  };
  const getAvatarDocs = async () => {
    const avatarDocs = await axios.get(
      `/api/avatar/list/documents/${avatarId}`
    );
    console.log("avatarDocs: ", avatarDocs);
    setAvatarDocs(avatarDocs?.data);
  };
  useEffect(() => {
    getAvatarDetails();
    getAvatarDocs();
  }, []);
  console.log("avatarDetails: ", avatarDetails);

  const handleAvatarNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvatarName(e.target.value);
  };

  const handleSystemPromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully.");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleCreateAvatar = async () => {
    const resp = await axios.post("/api/avatar", {
      name: avatarName,
      description: systemPrompt,
    });
    console.log("resp ", resp);
  };

  const handleUploadPDF = async () => {
    if (!file) {
      alert("No file to be uploaded");
      return;
    }
    try {
      setUploading(async () => {
        let { url } = await uploadToS3(file);
        console.log("File uploaded successfully:", url);
        setReaderFileUrl(url);
        setReaderFileName(file.name);
        const createDocObj = {
          fileUrl: url,
          avatarId: avatarId,
          fileName: file.name,
        };

        const createDocResp = await axios.post(
          "/api/document/create",
          createDocObj
        );
        console.log("createDocResp", createDocResp);

        const resp = await axios.post("/api/upload/pdf", {
          fileName: file.name,
          fileUrl: url,
        });
        console.log("resp: ", resp);
        alert("Successfully uploaded to knowledge base");
        return;
      });
    } catch (e: any) {
      console.error(e);
      alert("Error in uploading to knowledge base");
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      <h1 className="text-2xl font-bold my-4 mt-14">
        Dashboard for Avatar: {avatarDetails?.name}
      </h1>
      <button>
        <h1 className="text-2xl font-bold my-4 mt-14">go back</h1>
      </button>
      {avatarDetails?.description && (
        <h3 className="text-xl my-2">{avatarDetails.description}</h3>
      )}

      <div className="my-4">
        <label htmlFor="avatarName" className="block mb-2">
          Avatar Name:
        </label>
        <input
          type="text"
          id="avatarName"
          value={avatarName}
          onChange={handleAvatarNameChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="my-4">
        <textarea
          placeholder="AI avatar character - add the system prompt here"
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button className="m-4" onClick={handleCreateAvatar}>
        update avatar
      </button>
      <div className="my-4">
        <label htmlFor="fileUpload" className="block mb-2">
          Upload Files to Knowledge Base:
        </label>
        <FileDrop setFile={setFile} file={file} />
        <button
          onClick={handleUploadPDF}
          className="bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Files
        </button>
      </div>
      <div className="flex flex-col m-6">
        <h2>Uploaded Documents:</h2>
        <div className="my-3 flex flex-col space-y-2">
          {avatarDocs.map((doc: any, i: number) => {
            return (
              <div className="p-4 border rounded" key={`doc_${i}`}>
                <h3 className="mb-3">doc file name: {doc.fileName}</h3>
                <h5 className="mb-3">doc file url: {doc.fileUrl}</h5>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvatarPage;
