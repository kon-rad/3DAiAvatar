import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("requestBody ", requestBody);

  try {
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }

  return NextResponse.json({
    text: "hello world from chat/route",
  });
}
