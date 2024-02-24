import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  // const requestBody = await request.json();
  // console.log("avatar requestBody ", requestBody);

  try {
    const { db } = await connectToDatabase();

    // Fetch all avatars
    const avatars = await db.collection("avatars").find({}).toArray();
    console.log("avatar request response ", avatars);

    return NextResponse.json({
      avatars,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }
}
