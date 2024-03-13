'use client';

import { PrismaClient } from '@prisma/client';
import { Text, Button } from '@radix-ui/themes';
import { makeAutoObservable } from 'mobx';
import { useMemo } from 'react';

import { submit } from './actions';
import { useFormState } from 'react-dom';

// class Sample {
//   transcription_file: string = "";
//   video_file: string = "";
//   ai_note: string = '';

//   constructor() {
//     makeAutoObservable(this, {}, { autoBind: true });
//   }

//   setTranscriptionFile(file: string) {
//     this.transcription_file = file;
//   }

//   setVideoFile(file: string) {
//     console.log(file);
//     this.video_file = file;
//   }

//   setAiNote(note: string) {
//     this.ai_note = note;
//   }
// }

export default function Page() {
  // const [errorMessage, dispatch] = useFormState(submit, undefined);
  // const sample = useMemo(() => new Sample(), []);

  return (
    <div>
      <h1>Create a sample</h1>
      <form action={submit}>
        <Text as='label'>
          Upload the video recording
          <input type='file' name="recording" />
          {/* <input type='file' name="recording" value={sample.video_file} onChange={e => sample.setVideoFile(e.target.value)} /> */}
        </Text>
        {/* <Text as='label'>
          Upload the transcription
          <textarea name="transcription" onChange={(e) => sample.setTranscriptionFile} />
        </Text>
        <Text as='label'>
          AI Note
          <textarea name="notes" onChange={(e) => sample.setAiNote} />
        </Text> */}

        <Button>Create</Button>
      </form>
    </div>
  );
}
