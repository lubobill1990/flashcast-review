import { NextRequest, NextResponse } from "next/server";
import { getSampleOutputOrThrow } from "../sample-output-api-util";
import { prisma } from "@flashcast/db";
import { z } from "zod";

const Status = z.enum([
  "queued",
  "processing",
  "completed",
  "error",
  "canceled",
]);

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get("token");
  const { status } = await req.json();

  if (!token) {
    return NextResponse.error();
  }

  try {
    const validStatus = Status.parse(status);

    const sampleOutput = await getSampleOutputOrThrow(id, token);

    await prisma.sampleOutput.update({
      where: { id: sampleOutput.id },
      data: { status: validStatus },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.error();
  }
}
