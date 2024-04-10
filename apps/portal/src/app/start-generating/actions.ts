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

const getBlobId = (file: File) => UUID() + "." + file.name;

export async function getUploadUrl(file: File) {
  const { blobUrl, sasUrl } = await factory.sampleService.generateSampleUrl(
    getBlobId(file)
  );
  return { blobUrl, sasUrl };
}

export async function submit(
  recordingUrl: string,
  transcriptionUrl: string,
  notes: string
) {
  const user = await factory.userService.getUser();

  const sample = await factory.sampleService.createSample(
    recordingUrl,
    transcriptionUrl,
    notes
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
