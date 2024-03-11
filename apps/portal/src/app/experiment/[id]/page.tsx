import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function Page({ params: { id } }) {
  const experiment = await prisma.experiment.findFirstOrThrow({
    where: {
      id,
    },
  });
  return <div>{experiment.name}</div>;
}
