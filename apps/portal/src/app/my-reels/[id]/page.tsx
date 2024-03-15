import { toInteger } from 'lodash-es';
import Link from 'next/link';
import factory from "@/factory";

type Params = {
  params: {
    id: string,
  }
}

export default async function Page({ params: { id } }: Params) {
  const sampleId = toInteger(id);
  const sampleOutput = await factory.sampleOutputService.getSampleOutput(sampleId);
  
  if (!sampleOutput) {
    return <div>Reels unavailable</div>
  }

  return (
    <div>
      <nav>
        <Link href={`/my-reels/${id}`}>Generated reels</Link>
        <Link href={`/my-reels/${id}/artifacts`}>Uploaded artifacts</Link>
      </nav>
      <div>
        Experiment: {sampleOutput.experimentId}
      </div>
      <div>
        Sample: {sampleOutput.sampleId}
      </div>
    </div>
  );
}
