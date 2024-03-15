import factory from '@/factory';

const prisma = factory.prismaClient;

export default async function Page({ params: { id } }) {
  const experiment = await prisma.experiment.findFirstOrThrow({
    where: {
      id,
    },
  });
  return <div>{experiment.name}</div>;
}
