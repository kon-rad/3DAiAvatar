import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const avatarId = url.pathname.split("/").pop();
  console.log("inside api documents list endpoint", url, avatarId);

  try {
    const { db } = await connectToDatabase();

    const avatarDocs = await db
      .collection("documents")
      .find({ avatarId: avatarId })
      .toArray();
    console.log("avatar request response ", avatarDocs);

    if (!avatarDocs) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return NextResponse.json(avatarDocs);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to fetch the avatar data" },
      { status: 500 }
    );
  }
}
