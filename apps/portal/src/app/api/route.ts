import { NextRequest, NextResponse } from "next/server";
import { auth } from "@flashcast/auth";
import { prisma } from "@flashcast/db";

export async function GET(_req: NextRequest) {
  const session = await auth();
  const experiments = await prisma.experiment.deleteMany();
  return NextResponse.json({ session, experiments });
}
