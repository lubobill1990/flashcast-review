'use client';

import { Sample } from '@prisma/client';
import { toInteger } from 'lodash-es';
import { getSample, getSampleOutput } from './actions';
import * as React from 'react';
import Link from 'next/link';

type SampleData = {
  recording: string;
  transcription: string;
  notes: string;
}

export default function Page({ params: { id } }) {
  const sampleId = toInteger(id);
  const [sample, setSample] = React.useState<Sample | undefined>();
  const [isFetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    getSampleOutput(sampleId)
      .then(sampleOutput => getSample(sampleOutput.sampleId))
      .then(sample => sample && setSample(sample))
      .catch(() => {})
      .finally(() => setFetching(false));
    }, [sampleId, setFetching, setSample]);
  
  if (isFetching) {
    return <div>Loading</div>
  }
  
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
