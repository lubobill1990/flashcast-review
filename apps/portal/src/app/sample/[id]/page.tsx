import { Prisma, PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash-es';
const prisma = new PrismaClient();

type SampleData = {
  recording: string;
  transcription: string;
  notes: string;
}

export default async function Page({ params: { id } }) {
  const sample = await prisma.sample.findFirstOrThrow({
    where: {
      id: toInteger(id),
    },
  });
  if (!sample?.data) {
    return <div>No Such Sample</div>
  }
  const data = sample.data as SampleData;
  return (
    <div>
      <label>Video recording file</label>
      <p><a href={data.recording}>{data.recording}</a></p>
      <label>Transcription file</label>
      <p><a href={data.transcription}>{data.transcription}</a></p>
      <label>AI Notes</label>
      <p>{data.notes}</p>
    </div>
  );
}
