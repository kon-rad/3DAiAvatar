import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("api/document/create requestBody ", requestBody);
  const { fileUrl, avatarId, fileName } = requestBody;

  const { db } = await connectToDatabase();

  // Insert the new avatar entry
  const result = await db
    .collection("documents")
    .insertOne({ fileUrl, avatarId, fileName });

  // Respond with success message and inserted document ID
  // return result.status(201).json({
  //   message: "Avatar created successfully",
  //   data: { id: result.insertedId },
  // });
  console.log("api/document/create result: ", result);

  try {
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }

  return NextResponse.json({
    text: "hello world from api/avatar",
  });
}
