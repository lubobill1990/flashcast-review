'use client'

import React from 'react';
import { toInteger } from 'lodash-es';
import Link from 'next/link';
import { ClipEvaluation, SampleOutputEvaluation, User } from '@prisma/client';
import { SampleOutput, getUser, getUserSampleOutputById, submitClipEvaluation, submitSampleOutputEvaluation, updateClipEvaluation, updateSampleOutputEvaluation } from './actions';

type Params = {
  params: {
    id: string,
  }
};

type ClipData = {
  clipUrl?: string;
} | undefined;

export default function Page({ params: { id } }: Params) {
  const sampleOutputId = toInteger(id);

  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | undefined>();
  const [sampleOutput, setSampleOutput] = React.useState<SampleOutput | undefined>();

  const fetchSampleOutput = React.useCallback(() => {
    setLoading(true);
    getUser()
      .then(user => { setUser(user); return user.id; })
      .then(userId => getUserSampleOutputById(userId, sampleOutputId))
      .then(sampleOutput => setSampleOutput(sampleOutput))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ sampleOutputId, setUser, setSampleOutput ]);

  React.useEffect(() => {
    fetchSampleOutput();
  }, [ fetchSampleOutput ]);

  return (
    <div>
      <nav>
        <Link href='/my-reels'>Back</Link>
        <Link href={`/my-reels/${id}`} className='active-nav-link'>Generated reels</Link>
        <Link href={`/my-reels/${id}/artifacts`}>Uploaded artifacts</Link>
      </nav>
      {
        isLoading
        ? <div>Loading</div>
        : user && sampleOutput 
        ? <>
            <div>
              Experiment ID: {sampleOutput.experimentId}
            </div>
            <div>
              Sample ID: {sampleOutput.sampleId}
            </div>
            <div>
              Sample Evaluation: 
              <SampleOutputEvaluationForm
                sampleOutputId={sampleOutput.id}
                userId={user.id}
                evaluation={sampleOutput.evaluations[0]}
                refetch={fetchSampleOutput}
              />
            </div>
            <div>
              Clips:
              <ul>
                {sampleOutput.clips.map(clip =>
                  <li key={clip.id}>
                    {(clip.data as ClipData)?.clipUrl}
                    <ClipEvaluationForm
                      clipId={clip.id}
                      userId={user.id}
                      evaluation={clip.evaluations[0]}
                      refetch={fetchSampleOutput}
                    />
                  </li>
                )}
              </ul>
            </div>
          </>
        : <div>Reels unavailable</div>
      }
    </div>
  );
}

type ISampleOutputEvaluationFormProps = {
  sampleOutputId: number,
  userId: number,
  evaluation?: SampleOutputEvaluation,
  refetch: () => void;
}
function SampleOutputEvaluationForm(
  {
    sampleOutputId,
    userId,
    evaluation,
    refetch,
  }: ISampleOutputEvaluationFormProps
) {
  const handleSubmit = (formData: FormData) => {
    const score = toInteger(formData.get('score') as string);
    const comment = formData.get('comment') as string;
    evaluation
      ? updateSampleOutputEvaluation(
          evaluation.id,
          score,
          comment,
        )
      : (submitSampleOutputEvaluation(
          sampleOutputId,
          userId,
          score,
          comment,
        ), refetch());
  }
  return (
    <form action={handleSubmit}>
      <label>score</label>
      <input name='score' type='number' min='1' max='5' defaultValue={evaluation?.score} />
      <label>comment</label>
      <textarea name='comment' defaultValue={evaluation?.comment || ''} />
      <button type='submit'>submit</button>
    </form>
  )
}

type IClipEvaluationFormProps = {
  clipId: number,
  userId: number,
  evaluation?: ClipEvaluation,
  refetch: () => void;
}
function ClipEvaluationForm(
  {
    clipId,
    userId,
    evaluation,
    refetch,
  }: IClipEvaluationFormProps
) {
  const handleSubmit = (formData: FormData) => {
    const score = toInteger(formData.get('score') as string);
    const comment = formData.get('comment') as string;
    evaluation
      ? updateClipEvaluation(
          evaluation.id,
          score,
          comment,
        )
      : (submitClipEvaluation(
          clipId,
          userId,
          score,
          comment,
        ), refetch());
  }
  return (
    <form action={handleSubmit}>
      <label>score</label>
      <input name='score' type='number' min='1' max='5' defaultValue={evaluation?.score} />
      <label>comment</label>
      <textarea name='comment' defaultValue={evaluation?.comment || ''} />
      <button type='submit'>submit</button>
    </form>
  )
}
