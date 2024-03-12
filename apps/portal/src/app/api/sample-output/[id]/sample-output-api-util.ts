import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export async function getSampleOutputOrThrow(
  prisma: PrismaClient,
  id: string,
  jwtToken: string
) {
  const sampleOutput = await prisma.sampleOutput.findFirstOrThrow({
    where: { id: Number(id) },
  });

  const payload = jwt.verify(jwtToken, sampleOutput.jwtSecret) as any;

  if (
    !payload ||
    payload.iss !== 'flashcast' ||
    // payload.sub !== 'sample-output' ||
    payload.id !== sampleOutput.id
  ) {
    throw new Error('Unauthorized');
  }

  return sampleOutput;
}
