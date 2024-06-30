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
  meetingTitle: string,
  recordingUrl: string,
  transcriptUrl: string,
  aiNotes: string
) {
  const user = await factory.userService.getUser();

  const sample = await factory.sampleService.createSample(
    meetingTitle,
    recordingUrl,
    transcriptUrl,
    aiNotes
  );

  const experiment = await factory.experimentService.createExperiment(
    user.id,
    UUID(),
    "",
    undefined,
    [sample.id]
  );

  const clipGenerator = new ClipGeneratorProxy(prisma);
  await clipGenerator.startExperiment(experiment.id);

  return Promise.resolve();
}

export async function getUserInfo() {
  const session = await auth();
  console.log("getUserInfo", { session }, Date.now());
}

export async function getAllExperiments() {
  const user = await factory.userService.getUser();
  return await factory.experimentService.getAllExperiments(user.id);
}

export async function startExperiment(experimentId: number) {
  const clipGenerator = new ClipGeneratorProxy(prisma);
  await clipGenerator.startExperiment(experimentId);
}
