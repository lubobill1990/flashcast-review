'use server'

import factory from "@/factory";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSampleOutputs() {
  const user = await factory.userService.getUser();
  return prisma.sampleOutput.findMany({
    where: {
      sample: {userId: user.id}
    }
  });
}