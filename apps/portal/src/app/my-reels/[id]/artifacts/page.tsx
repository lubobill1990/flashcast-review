import { toInteger } from 'lodash-es';
import Link from 'next/link';
import factory from "@/factory";

type SampleData = {
  recording: string;
  transcription: string;
  notes: string;
}

type Params = {
  params: {
    id: string,
  }
}

export default async function Page({ params: { id } }: Params) {
  const sampleId = toInteger(id);
  const sample = (await factory.sampleOutputService.getSampleOutput(sampleId)).sample;
  
  if (!sample?.data) {
    return <div>Artifacts unavailable</div>
  }

  const data = sample.data as SampleData;

  return (
    <div>
      <nav>
        <Link href={`/my-reels/${id}`}>Generated reels</Link>
        <Link href={`/my-reels/${id}/artifacts`}>Uploaded artifacts</Link>
      </nav>
      <div>
        Recording: {data.recording}
      </div>
      <div>
        Transcription: {data.transcription}
      </div>
      <div>
        AI Notes: {data.notes}
      </div>
    </div>
  );
}
