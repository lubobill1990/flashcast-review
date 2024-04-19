import { prisma } from "@flashcast/db";
import jwt from "jsonwebtoken";
import { toInteger } from "lodash-es";

export async function getSampleOutputOrThrow(id: string, jwtToken: string) {
  const sampleOutput = await prisma.sampleOutput.findFirstOrThrow({
    where: { id: toInteger(id) },
  });

  const payload = jwt.verify(jwtToken, sampleOutput.jwtSecret) as any;

  if (
    !payload ||
    payload.iss !== "flashcast" ||
    // payload.sub !== 'sample-output' ||
    payload.id !== sampleOutput.id
  ) {
    throw new Error("Unauthorized");
  }

  return sampleOutput;
}
