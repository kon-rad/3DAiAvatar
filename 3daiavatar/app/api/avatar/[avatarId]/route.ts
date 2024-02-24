import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const avatarId = url.pathname.split("/").pop();
  console.log("inside api avatar id endpoint", url, avatarId);

  try {
    const { db } = await connectToDatabase();

    // Fetch the avatar by ID
    const avatar = await db
      .collection("avatars")
      .findOne({ _id: new ObjectId(avatarId) });
    console.log("avatar request response ", avatar);

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return NextResponse.json(avatar);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to fetch the avatar data" },
      { status: 500 }
    );
  }
}
