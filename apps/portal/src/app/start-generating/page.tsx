"use client";

import { submit, getUploadUrl } from "./actions";
import Branding from "../branding";
import {
  MainPageCard,
  Textarea,
  Label,
  Field,
  Button,
  VideoClipWandIcon,
  Link,
} from "portal-ui";

import axios, { AxiosProgressEvent } from "axios";
import { useState } from "react";
import { ProgressBar } from "@fluentui/react-components";
import NextLink from "next/link";

type STATUS = "fill-form" | "uploading" | "starting" | "started";

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
  const [status, setStatus] = useState<STATUS>("fill-form");

  return (
    <>
      <Branding />
      <MainPageCard activePage="start_generating">
        {status === "started" ? (
          <GeneratingPage setStatus={setStatus} />
        ) : (
          <ArtifactsForm status={status} setStatus={setStatus} />
        )}
      </MainPageCard>
    </>
  );
}

const ArtifactsForm = ({
  status,
  setStatus,
}: {
  status: STATUS;
  setStatus: (status: STATUS) => void;
}) => {
  const [
    recordingUploadProgress,
    setRecordingUploadProgress,
    showRecordingUploadProgress,
  ] = useProgress();
  const [
    transcriptUploadProgress,
    setTranscriptUploadProgress,
    showTranscriptUploadProgress,
  ] = useProgress();

  const handleSubmit = async (formData: FormData) => {
    const recording = formData.get("recording") as File;
    const transcript = formData.get("transcript") as File;
    const notes = formData.get("notes") as string;

    const splitTranscriptFileName = transcript.name.split(".");
    splitTranscriptFileName.pop();
    const meetingTitle = splitTranscriptFileName.join(".");

    const { blobUrl: recordingUrl, sasUrl: recordingSASUrl } =
      await getUploadUrl(recording.name);
    const { blobUrl: transcriptUrl, sasUrl: transcriptSASUrl } =
      await getUploadUrl(transcript.name);

    console.log("recordingSASUrl:", recordingSASUrl);
    console.log("transcriptSASUrl:", transcriptSASUrl);

    setStatus("uploading");
    await Promise.allSettled([
      upload(recordingSASUrl, recording, ({ loaded, total }) => {
        setRecordingUploadProgress(loaded / total);
      }),
      upload(transcriptSASUrl, transcript, ({ loaded, total }) => {
        setTranscriptUploadProgress(loaded / total);
      }),
    ]);
    setRecordingUploadProgress(1);
    setTranscriptUploadProgress(1);

    setStatus("starting");
    await submit(meetingTitle, recordingUrl, transcriptUrl, notes);
    setStatus("started");
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Label size="large">
        Upload recording file, transcript and AI notes from Meeting recap to
        generate short clips that capture the key meeting moments and summaries.
      </Label>
      <Field
        required
        label={
          <Label weight="semibold" htmlFor="recording-input">
            Recording
          </Label>
        }
        hint={`Upload the recording file from your device. Supporting file type: .mp4 and .mov files.`}
      >
        <input
          id="recording-input"
          type="file"
          name="recording"
          accept=".mp4,.mov"
        />
        {showRecordingUploadProgress && (
          <ProgressBar className="mt-1" value={recordingUploadProgress} />
        )}
      </Field>
      <Field
        required
        label={
          <Label weight="semibold" htmlFor="transcript-input">
            Transcript
          </Label>
        }
        hint={`Go to Meeting Recap and click on “Download” under Transcript. Supporting file type: .docx file.`}
      >
        <input
          id="transcript-input"
          type="file"
          name="transcript"
          accept=".docx"
        />
        {showTranscriptUploadProgress && (
          <ProgressBar className="mt-1" value={transcriptUploadProgress} />
        )}
      </Field>
      <Field
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
          icon={status === "fill-form" ? <VideoClipWandIcon /> : undefined}
          disabled={status !== "fill-form"}
        >
          {status === "fill-form"
            ? "Start generating reels"
            : status === "uploading"
            ? "Uploading artifacts..."
            : status === "starting"
            ? "Starting experiment..."
            : "Generating..."}
        </Button>
      </div>
    </form>
  );
};

const GeneratingPage = ({
  setStatus,
}: {
  setStatus: (status: STATUS) => void;
}) => {
  const handleStartover = () => {
    setStatus("fill-form");
  };

  return (
    <div
      style={{
        width: "450px",
        height: "150px",
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        placeContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: "16px",
          lineHeight: "22px",
        }}
      >
        <p>This may take about 20 minutes.</p>
        <p>
          Go to{" "}
          <Link
            style={{
              fontSize: "16px",
              lineHeight: "22px",
            }}
          >
            <NextLink href="my-reels">My reels</NextLink>
          </Link>{" "}
          to view all the reel generation tasks.
        </p>
      </div>
      <ProgressBar style={{ margin: "25px 0px" }} />
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Button onClick={handleStartover}>Generate new reels</Button>
      </div>
    </div>
  );
};
