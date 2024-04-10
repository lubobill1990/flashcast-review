import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@flashcast/db";

export async function GET(_req: NextRequest) {
  const session = await getServerSession();
  const experiments = await prisma.experiment.deleteMany();
  return NextResponse.json({ session, experiments });
}
