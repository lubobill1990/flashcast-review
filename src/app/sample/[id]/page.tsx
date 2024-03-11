import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page({ params: { id } }) {
  const sample = await prisma.sample.findFirstOrThrow({
    where: {
      id,
    },
  });
  return <div>{sample.data?.toString()}</div>;
}
