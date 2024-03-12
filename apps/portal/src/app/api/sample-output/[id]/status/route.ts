import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getSampleOutputOrThrow } from '../sample-output-api-util';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get('token');
  const { status } = await req.json();
  console.log({ status, id });

  if (
    !token ||
    !status ||
    !['queued', 'processing', 'completed', 'error', 'canceled'].includes(status)
  ) {
    return NextResponse.error();
  }

  const sampleOutput = await getSampleOutputOrThrow(prisma, id, token);

  await prisma.sampleOutput.update({
    where: { id: sampleOutput.id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}