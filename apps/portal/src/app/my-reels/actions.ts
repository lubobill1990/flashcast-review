"use server";

import factory from "@/factory";

const prisma = factory.prismaClient;

export async function getSampleOutputs() {
  const user = await factory.userService.getUser();
  return prisma.sampleOutput.findMany({
    where: {
      sample: { userId: user.id },
    },
  });
}
