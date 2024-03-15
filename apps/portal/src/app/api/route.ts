import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextApiRequest } from 'next';
import factory from '@/factory';

const prisma = factory.prismaClient;

export async function GET(req: NextApiRequest) {
  const session = await getServerSession();
  const experiments = await prisma.experiment.deleteMany();
  return NextResponse.json({ session, experiments });
}
