import { prisma } from "@flashcast/db";


export default async function Page() {
  const experiments = await prisma.experiment.findMany();
  return <div>{experiments.map((v) => v.id)}</div>;
}
