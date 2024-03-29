import factory from "@/factory";

const prisma = factory.prismaClient;

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const experiment = await prisma.experiment.findFirstOrThrow({
    where: {
      id: parseInt(id, 10),
    },
  });
  return <div>{experiment.name}</div>;
}
