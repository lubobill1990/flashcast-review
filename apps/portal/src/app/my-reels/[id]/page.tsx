'use client';

import { SampleOutput } from '@prisma/client';
import { toInteger } from 'lodash-es';
import { getSampleOutput } from './actions';
import * as React from 'react';
import Link from 'next/link';

export default function Page({ params: { id } }) {
  const sampleId = toInteger(id);
  const [sampleOutput, setSampleOutput] = React.useState<SampleOutput | undefined>();
  const [isFetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    getSampleOutput(sampleId)
      .then(sampleOutput => sampleOutput && setSampleOutput(sampleOutput))
      .catch(() => {})
      .finally(() => setFetching(false));
    }, [sampleId, setFetching, setSampleOutput]);
  
  if (isFetching) {
    return <div>Loading</div>
  }
  
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
