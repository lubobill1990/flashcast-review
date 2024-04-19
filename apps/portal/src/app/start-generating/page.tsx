"use client";

import { useRouter } from "next/navigation";
import { submit, getUploadUrl } from "./actions";
import Branding from "../branding";
import {
  MainPageCard,
  Textarea,
  Label,
  Field,
  Button,
  Divider,
  VideoClipWandIcon,
} from "portal-ui";

import axios, { AxiosProgressEvent } from "axios";
import { useState } from "react";
import { ProgressBar } from "@fluentui/react-components";

async function upload(
  url: string,
  file: File,
  onUploadProcess?: (
    progressEvent: AxiosProgressEvent & { total: number }
  ) => void
) {
  return await axios.put(url, file, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
    onUploadProgress: function (progressEvent) {
      onUploadProcess?.({
        ...progressEvent,
        total: progressEvent.total ?? file.size,
      });
    },
  });
}

function useProgress() {
  const [progress, setProgress] = useState(0);
  return [progress, setProgress, progress > 0 && progress < 1] as [
    number,
    typeof setProgress,
    boolean
  ];
}

export default function Page() {
  const router = useRouter();

  const [
    recordingUploadProgress,
    setRecordingUploadProgress,
    showRecordingUploadProgress,
  ] = useProgress();
  const [
    transcriptionUploadProgress,
    setTranscriptionUploadProgress,
    showTranscriptionUploadProgress,
  ] = useProgress();

  const handleSubmit = async (formData: FormData) => {
    const recording = formData.get("recording") as File;
    const transcription = formData.get("transcription") as File;
    const notes = formData.get("notes") as string;

    const { blobUrl: recordingUrl, sasUrl: recordingSASUrl } =
      await getUploadUrl(recording.name);
    const { blobUrl: transcriptionUrl, sasUrl: transcriptionSASUrl } =
      await getUploadUrl(transcription.name);

    await Promise.allSettled([
      upload(recordingSASUrl, recording, ({ loaded, total }) => {
        setRecordingUploadProgress(loaded / total);
      }),
      upload(transcriptionSASUrl, transcription, ({ loaded, total }) => {
        setTranscriptionUploadProgress(loaded / total);
      }),
    ]);
    setRecordingUploadProgress(1);
    setTranscriptionUploadProgress(1);

    const id = await submit(recordingUrl, transcriptionUrl, notes);
    router.push(`/my-reels/${id}`);
  };

  return (
    <>
      <Branding />
      <MainPageCard activePage="start_generating">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Label size="large">
            Upload recording file, transcript and AI notes from Meeting recap to
            generate short clips that capture the key meeting moments and
            summaries.
          </Label>
          <Field
            required
            label={<Label weight="semibold">Recording</Label>}
            hint={`Upload the recording file from your device. Supporting file type: .mp4 and .mov files.`}
          >
            <input id="recording-input" type="file" name="recording" />
            {/* {recordingUploadProgress > 0 && recordingUploadProgress < 1 && ( */}
            {showRecordingUploadProgress && (
              <ProgressBar className="mt-1" value={recordingUploadProgress} />
            )}
          </Field>
          <Field
            required
            label={<Label weight="semibold">Transcription</Label>}
            hint={`Go to Meeting Recap and click on “Download” under Transcript. Supporting file type: .docx file.`}
          >
            <input id="transcription-input" type="file" name="transcription" />
            {showTranscriptionUploadProgress && (
              <ProgressBar
                className="mt-1"
                value={transcriptionUploadProgress}
              />
            )}
          </Field>
          <Field
            required
            label={<Label weight="semibold">AI notes</Label>}
            hint="Go to Meeting Recap and click on “Copy all” under AI notes. Paste in the full AI notes below."
          >
            <Textarea id="notes-input" name="notes" />
          </Field>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Button
              appearance="primary"
              type="submit"
              style={{
                background:
                  "linear-gradient(99.14deg, #499DFF -17.23%, #5E64FF 41.03%, #E64EFF 150.75%)",
              }}
              icon={<VideoClipWandIcon />}
              disabled={
                showRecordingUploadProgress || showTranscriptionUploadProgress
              }
            >
              Start generating reels
            </Button>
          </div>
        </form>
      </MainPageCard>
    </>
  );
}
