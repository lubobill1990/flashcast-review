import { NextRequest, NextResponse } from "next/server";
import { getSampleOutputOrThrow } from "../sample-output-api-util";
import { prisma } from "@flashcast/db";
import { z } from "zod";

const ClipRequest = z.object({
  headline: z.string().min(1),
  description: z.string().optional(),
  duration: z.number(),
  tags: z.string().array(),
  startTime: z.number(),
  endTime: z.number().min(0),
  storagePath: z.string().url().min(1),
  payload: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.error();
  }

  try {
    const reqData = await req.json();
    const clipData = ClipRequest.parse(reqData);

    console.log({
      clipData,
    });

    const sampleOutput = await getSampleOutputOrThrow(id, token);

    await prisma.clip.create({
      data: {
        videoUrl: clipData.storagePath,
        headline: clipData.headline,
        description: clipData.description,
        duration: clipData.duration,
        tags: clipData.tags,
        startTime: clipData.startTime,
        endTime: clipData.endTime,
        payload: clipData.payload,
        data: {},
        sampleOutput: {
          connect: {
            id: sampleOutput.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }
}
