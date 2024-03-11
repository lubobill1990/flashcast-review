import { PrismaClient } from '@prisma/client';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
const prisma = new PrismaClient();

export default async function Page() {
  const experiments = await prisma.experiment.findMany();
  return (
    <div>
      <div>
        <Button asChild>
          <Link href='/experiment/create'>Create experiment</Link>
        </Button>
      </div>
      <div>{experiments.map((v) => v.id)}</div>
    </div>
  );
}
