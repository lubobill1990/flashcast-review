import factory from '@/factory';

const prisma = factory.prismaClient;

export default async function Page() {
  const experiments = await prisma.experiment.findMany();
  return <div>{experiments.map((v) => v.id)}</div>;
}
