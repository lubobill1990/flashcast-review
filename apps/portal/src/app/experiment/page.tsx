import factory from '@/factory';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';

const prisma = factory.prismaClient;

export default async function Page() {
  const experiments = await prisma.experiment.findMany();
  return (
    <div>
      <div>
        <Button asChild>
          <Link href='/experiment/create'>Create experiment</Link>
        </Button>
      </div>
      <ul>{experiments.map((v) => <li key={v.id}>{v.id}</li>)}</ul>
    </div>
  );
}
