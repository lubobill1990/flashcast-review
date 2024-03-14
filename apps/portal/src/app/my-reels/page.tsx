'use client'

import * as React from 'react';
import { PrismaClient, SampleOutput } from '@prisma/client';
import Link from 'next/link';
import Branding from '../branding';
import { getSampleOutputs } from './actions';

export default function Page() {
  const [isFetching, setFetching] = React.useState(true);
  const [sampleOutputs, setSampleOutputs] = React.useState<SampleOutput[]>();

  React.useEffect(() => {
    getSampleOutputs()
      .then(outputs => outputs && setSampleOutputs(outputs))
      .finally(() => setFetching(false));
  }, [setFetching, setSampleOutputs])

  return (
    <div>
      <Branding />
      <nav>
        <Link href='/start-generating'>Start generating</Link>
        <Link href='/my-reels'>My reels</Link>
      </nav>
      {
        isFetching
          ? <p>Loading</p>
          : (
            sampleOutputs
              ? (
                <ul>
                  {sampleOutputs.map((v) =>
                    <li key={v.id}>
                      <Link href={`/my-reels/${v.id}`}>{v.id}</Link>
                    </li>
                  )}
                </ul>
              )
              : <p>Fail to fetch reels</p>
          )
      }
      
    </div>
  );
}
