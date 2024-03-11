import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page() {
  const experiments = await prisma.experiment.findMany();
  return <div>{experiments.map((v) => v.id)}</div>;
}
