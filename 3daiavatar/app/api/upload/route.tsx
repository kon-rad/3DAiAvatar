/**

import "server-only";
import { getUserData } from "@/lib/database/user";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { config } from "@/lib/utils/config";

import { NextResponse } from "next/server";

export const runtime = "edge";

// S3_UPLOAD_KEY=AKIAYEDSK6RN6D4ZBAO6
// S3_UPLOAD_SECRET=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
// S3_UPLOAD_BUCKET=beagentic
// S3_UPLOAD_REGION=us-west-1
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createRequestPresigner } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
});

export async function POST(req: Request) {
  const file = req.body || "";
  const filename = req.headers.get("x-vercel-filename") || "file.txt";
  const contentType = req.headers.get("content-type") || "text/plain";
  const fileType = `.${contentType.split("/")[1]}`;
  console.log("/api/upload ", filename, fileType, contentType);

  // construct final filename based on content-type if not provided
  const finalName = filename.includes(fileType)
    ? filename
    : `${filename}${fileType}`;

  // const key = Date.now().toString() + '-' + filename;

  const putParams = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: finalName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    await s3.send(new PutObjectCommand(putParams));

    const signedUrl = await createRequestPresigner(s3);
    const url = signedUrl(putParams, { expiresIn: 60 * 60 * 1000 }); // 1 hour

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading file to S3" });
  }

  // const blob = await put(finalName, file, {
  //   contentType,
  //   access: "public",
  // });

  // return NextResponse.json(blob);
  return NextResponse.json({ body: "hello " });
}

 */
