import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextApiRequest } from 'next';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest) {
  const session = await getServerSession();
  const experiments = await prisma.experiment.deleteMany();
  return NextResponse.json({ session, experiments });
}
