import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const FIREWORKS_API_URL =
  "https://api.fireworks.ai/inference/v1/chat/completions";
const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY; // Assuming you've stored your API key in .env.local

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("requestBody ", requestBody);
  const { message } = requestBody;
  try {
    const requestBody = {
      model: "accounts/fireworks/models/llama-v2-7b-chat",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };

    const fireworksResponse = await fetch(FIREWORKS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIREWORKS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("fireworksResponse: ", fireworksResponse);

    if (!fireworksResponse.ok) {
      throw new Error(
        `Fireworks API responded with status ${fireworksResponse.status}`
      );
    }

    const data = await fireworksResponse.json();
    console.log("response data ", data);

    return NextResponse.json({
      message: data,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }
}
