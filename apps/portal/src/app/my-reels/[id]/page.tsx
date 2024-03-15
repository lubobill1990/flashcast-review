'use client';

import React, { useState } from 'react';
import { sample, toInteger } from 'lodash-es';
import Link from 'next/link';
import { ClipEvaluation, SampleOutputEvaluation, User } from '@prisma/client';
import { Rating, RatingProps } from '@fluentui/react-rating-preview';
import { Field, mergeClasses, Textarea } from '@fluentui/react-components';

import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
} from '@fluentui/react-components';

import PlayIcon from './play.svg';

import {
  SampleOutput,
  getUser,
  getUserSampleOutputById,
  submitClipEvaluation,
  submitSampleOutputEvaluation,
  updateClipEvaluation,
  updateSampleOutputEvaluation,
} from './actions';

type Params = {
  params: {
    id: string;
  };
};

type ClipData =
  | {
      clipUrl?: string;
      clipTitle?: string;
    }
  | undefined;

export default function Page({ params: { id } }: Params) {
  const sampleOutputId = toInteger(id);

  const [isLoading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | undefined>();
  const [sampleOutput, setSampleOutput] = React.useState<
    SampleOutput | undefined
  >();

  const fetchSampleOutput = React.useCallback(() => {
    setLoading(true);
    getUser()
      .then((user) => {
        setUser(user);
        return user.id;
      })
      .then((userId) => getUserSampleOutputById(userId, sampleOutputId))
      .then((sampleOutput) => setSampleOutput(sampleOutput))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sampleOutputId, setUser, setSampleOutput]);

  React.useEffect(() => {
    fetchSampleOutput();
  }, [fetchSampleOutput]);

  const videoFileUrl = (sampleOutput?.sample?.data as any)?.recording;

  return (
    <div>
      {isLoading ? (
        <div>Loading</div>
      ) : user && sampleOutput ? (
        <SampleOutputDetails
          sampleOutput={sampleOutput}
          user={user}
          fetchSampleOutput={fetchSampleOutput}
        ></SampleOutputDetails>
      ) : (
        <div>Reels unavailable</div>
      )}
    </div>
  );
}

const SampleOutputDetails = ({
  sampleOutput,
  user,
  fetchSampleOutput,
}: {
  sampleOutput: SampleOutput;
  user: User;
  fetchSampleOutput: () => void;
}) => {
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  const selectedClip = sampleOutput.clips[selectedClipIndex];
  console.log(selectedClip, sampleOutput);
  // const clipUrl = (selectedClip.data as ClipData)?.clipUrl;
  const clipUrl =
    'https://flashcastreview.blob.core.windows.net/samples/4691e320-2f5a-4cc2-9302-962281bfb0cd.sample.mp4';
  const [tab, setTab] = useState('tab1');

  return (
    <>
      <div className='flex'>
        <div className='w-[30%]'>
          <video
            className='aspect-[9/16] rounded-lg'
            controls
            src={clipUrl}
          ></video>
        </div>
        <div className='flex-1 ml-3 bg-[#ffffffcc] rounded-lg shadow-lg'>
          <div className='flex p-4'>
            <div className='flex flex-col flex-1'>
              <h1>
                <span className='font-bold'>
                  {sampleOutput.clips.length} Reels
                </span>{' '}
                generated from {sample.name}
              </h1>
              <div>{sampleOutput.createdAt.toLocaleDateString()}</div>
              <p>
                {sampleOutput.sample.isPublic
                  ? 'Generated reels is public to everyone.'
                  : 'Generated reels are only visible to you.'}
              </p>
            </div>
            <div>
              <SampleOutputEvaluationForm
                sampleOutputId={sampleOutput.id}
                userId={user.id}
                evaluation={sampleOutput.evaluations[0]}
                refetch={fetchSampleOutput}
              />
            </div>
          </div>

          <TabList
            className='px-4'
            selectedValue={tab}
            onTabSelect={(e, data) => {
              console.log(e, data);
              setTab(data.value as string);
            }}
          >
            <Tab value='tab1'>Generated reels</Tab>
            <Tab value='tab2'>Uploaded artifacts</Tab>
          </TabList>
          {tab === 'tab1' && (
            <div>
              <ul>
                {sampleOutput.clips.map((clip, i) => (
                  <li
                    className={mergeClasses(
                      selectedClip.id === clip.id && 'bg-[#E8EBFA]',
                      'flex items-center py-2 px-4 gap-3',
                      i !== 0 && 'border-t border-[#F0F0F0]'
                    )}
                    key={clip.id}
                  >
                    <div>
                      <button
                        className='w-10 h-10 flex items-center justify-center'
                        onClick={() => setSelectedClipIndex(i)}
                      >
                        <PlayIcon></PlayIcon>
                      </button>
                    </div>
                    <div>
                      <video
                        className='w-[52px] aspect-[9/16] rounded-md'
                        src={clipUrl}
                      ></video>
                    </div>
                    <div className='flex-1'>
                      {(clip.data as ClipData)?.clipTitle ??
                        'Executive summary reel'}
                    </div>

                    <ClipEvaluationForm
                      clipId={clip.id}
                      userId={user.id}
                      evaluation={clip.evaluations[0]}
                      refetch={fetchSampleOutput}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'tab2' && <div></div>}
        </div>
      </div>
    </>
  );
};

type ISampleOutputEvaluationFormProps = {
  sampleOutputId: number;
  userId: number;
  evaluation?: SampleOutputEvaluation;
  refetch: () => void;
};
function SampleOutputEvaluationForm({
  sampleOutputId,
  userId,
  evaluation,
  refetch,
}: ISampleOutputEvaluationFormProps) {
  const handleSubmit = (formData: FormData) => {
    const score = toInteger(formData.get('score') as string);
    const comment = formData.get('comment') as string;
    evaluation
      ? updateSampleOutputEvaluation(evaluation.id, score, comment)
      : (submitSampleOutputEvaluation(sampleOutputId, userId, score, comment),
        refetch());
  };

  return (
    <form action={handleSubmit} className='flex flex-col gap-2 items-end'>
      <Rating
        defaultValue={evaluation?.score}
        name='score'
        size='large'
      ></Rating>
      <Textarea
        name='comment'
        defaultValue={evaluation?.comment || ''}
        placeholder='What do you like about this reel? What do you think can be improved?'
      />
    </form>
  );
}

type IClipEvaluationFormProps = {
  clipId: number;
  userId: number;
  evaluation?: ClipEvaluation;
  refetch: () => void;
};
function ClipEvaluationForm({
  clipId,
  userId,
  evaluation,
  refetch,
}: IClipEvaluationFormProps) {
  const handleSubmit = (formData: FormData) => {
    const score = toInteger(formData.get('score') as string);
    const comment = formData.get('comment') as string;
    evaluation
      ? updateClipEvaluation(evaluation.id, score, comment)
      : (submitClipEvaluation(clipId, userId, score, comment), refetch());
  };
  return (
    <form action={handleSubmit} className='flex flex-col gap-2 items-end'>
      <Rating
        defaultValue={evaluation?.score}
        name='score'
        size='large'
      ></Rating>
      <Textarea name='comment' defaultValue={evaluation?.comment || ''} />
    </form>
  );
}
