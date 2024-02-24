import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("requestBody ", requestBody);

  const { db } = await connectToDatabase();
  const avatars = await db.collection("avatars").find({}).toArray(); // This line automatically creates the 'avatars' collection if it doesn't exist.

  res
    .status(200)
    .json({ message: "Avatars fetched successfully", data: avatars });
  try {
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }

  return NextResponse.json({
    text: "hello world from chat/route",
  });
}
