import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Page() {
  const samples = await prisma.sample.findMany();
  return <div>{samples.map((v) => v.id)}</div>;
}
