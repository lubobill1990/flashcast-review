import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import factory from "@/factory";

const prisma = factory.prismaClient;

export async function GET(_req: NextRequest) {
  const session = await getServerSession();
  const experiments = await prisma.experiment.deleteMany();
  return NextResponse.json({ session, experiments });
}
