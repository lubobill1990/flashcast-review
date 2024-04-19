"use server";

import factory from "@/factory";
import { auth, getUser } from "@flashcast/auth";
import { v4 as UUID } from "uuid";

const getBlobId = (blobName: string) =>
  `${UUID()}.${blobName.split(".").pop()}`;

export async function getUploadUrl(fileName: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const { blobUrl, sasUrl } = await factory.sampleService.generateSampleUrl(
    `u-${user.uuid}`,
    getBlobId(fileName)
  );
  return { blobUrl, sasUrl };
}

export async function submit(
  recordingUrl: string,
  transcriptionUrl: string,
  aiNotes: string
) {
  const user = await factory.userService.getUser();

  const sample = await factory.sampleService.createSample(
    recordingUrl,
    transcriptionUrl,
    aiNotes
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
  // Promise.allSettled(
  //   new Array(random(3, 7))
  //     .fill(0)
  //     .map(() =>
  //       factory.clipService.createClip(
  //         sampleOutput.id,
  //         (sample.data as SampleData)?.recording || ""
  //       )
  //     )
  // );

  return Promise.resolve(sampleOutput.id);
}

export async function getUserInfo() {
  const session = await auth();
  console.log("getUserInfo", { session }, Date.now());
}
