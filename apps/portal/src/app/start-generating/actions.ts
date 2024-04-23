"use server";

import factory from "@/factory";
import { ClipGeneratorProxy } from "@/service/clip-generator-proxy";
import { auth, getUser } from "@flashcast/auth";
import { prisma } from "@flashcast/db";
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

  const clipGenerator = new ClipGeneratorProxy(prisma);
  await clipGenerator.startExperiment(sampleOutput.experimentId);

  return Promise.resolve(sampleOutput.id);
}

export async function getUserInfo() {
  const session = await auth();
  console.log("getUserInfo", { session }, Date.now());
}
