import { NextRequest, NextResponse } from 'next/server';
import { getSampleOutputOrThrow } from '../sample-output-api-util';
import factory from '@/factory';

const prisma = factory.prismaClient;

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get('token');

  // Parse the incoming form data
  const formData = await req.formData();

  // Get the file from the form data
  const file = formData.get('file') as File;

  if (!token || !file) {
    return NextResponse.error();
  }

  const sampleOutput = await getSampleOutputOrThrow(prisma, id, token);

  // TODO save file to file system

  await prisma.clip.create({
    data: {
      sampleOutput: {
        connect: {
          id: sampleOutput.id,
        },
      },
      data: {
        file: {
          filename: file.name,
        },
      },
    },
  });

  return NextResponse.json({ success: true });
}
