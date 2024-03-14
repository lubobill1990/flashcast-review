import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
const prisma = new PrismaClient();

export default async function Page() {
  const samples = await prisma.sample.findMany();
  return (
    <div>
      <ul>{samples.map((v) => <li key={v.id}><Link href={`/sample/${v.id}`}>{v.id}</Link></li>)}</ul>
      <Link href="/sample/create">Create new sample</Link>
    </div>
  );
}
