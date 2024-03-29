"use server";

import factory from "@/factory";
import { random } from "lodash-es";
import { v4 as UUID } from "uuid";

type SampleData =
  | {
      recording: string;
      transcription: string;
      notes: string;
    }
  | null
  | undefined;

async function upload(url: string, file: File) {
  return await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type,
    },
  });
}

const getBlobId = (file: File) => UUID() + "." + file.name;

export async function submit(formData: FormData) {
  const user = await factory.userService.getUser();
  const recording = formData.get("recording") as File;
  const transcription = formData.get("transcription") as File;
  const notes = formData.get("notes") as string;

  const recordingUrl = await factory.sampleService.generateSampleUrl(
    getBlobId(recording)
  );
  const transcriptionUrl = await factory.sampleService.generateSampleUrl(
    getBlobId(transcription)
  );

  const uploadRecordingPromise = upload(recordingUrl, recording);
  const uploadTranscriptionPromise = upload(transcriptionUrl, transcription);

  const sample = await Promise.allSettled([
    uploadRecordingPromise,
    uploadTranscriptionPromise,
  ]).then(() =>
    factory.sampleService.createSample(recordingUrl, transcriptionUrl, notes)
  );

  const experiment = await factory.experimentService.createExperiment(
    user.id,
    UUID(),
    "",
    undefined,
    [sample.id]
  );
  const sampleOutput = await factory.sampleOutputService.createSampleOutput(
    experiment.id,
    sample.id
  );

  // Mock the creation of 10 clips
  Promise.allSettled(
    new Array(random(3, 7))
      .fill(0)
      .map(() =>
        factory.clipService.createClip(
          sampleOutput.id,
          (sample.data as SampleData)?.recording || ""
        )
      )
  );

  return Promise.resolve(sampleOutput.id);
}
