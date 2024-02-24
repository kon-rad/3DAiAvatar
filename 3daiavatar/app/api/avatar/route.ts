import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("avatar requestBody ", requestBody);
  const { name, description } = requestBody;

  const { db } = await connectToDatabase();

  // Insert the new avatar entry
  const result = await db
    .collection("avatars")
    .insertOne({ name, description });

  // Respond with success message and inserted document ID
  // return result.status(201).json({
  //   message: "Avatar created successfully",
  //   data: { id: result.insertedId },
  // });
  console.log("result: ", result);

  try {
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }

  return NextResponse.json({
    message: "successfully created ai avatar",
  });
}
