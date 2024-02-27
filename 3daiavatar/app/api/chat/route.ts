import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const AVATAR_ID = "65da532ee83fbb558d1ed662";

const FIREWORKS_API_URL =
  "https://api.fireworks.ai/inference/v1/chat/completions";
const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY; // Assuming you've stored your API key in .env.local

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log("/api/chat --- requestBody ", requestBody);
  const { message } = requestBody;

  const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";
  const messages = [
    {
      role: "system",
      content:
        "You are a Steve Jobs, answer the question and use the provided tool of a multiplication calculator when someone asks you to multiply two numbers..",
    },
    {
      role: "user",
      content: "What are Nike's net income in 2022?",
    },
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "use_multiplication_calculator",
        description: "perform a calculation for multiplication of two numbers",
        parameters: {
          type: "object",
          properties: {
            digit_one: {
              type: "integer",
              description: "The first number to multiply",
            },
            digit_two: {
              type: "integer",
              description: "The second number to multiply",
            },
          },
        },
      },
    },
  ];

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
    console.log("data::::: ", data);

    const respMessage = data.choices[0].message.content;
    console.log("response data ", data);
    console.log("response respMessage ", respMessage);

    return NextResponse.json({
      message: respMessage,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Failed to ingest your data" });
  }
}
