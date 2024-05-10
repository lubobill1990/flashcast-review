"use server";

import factory from "@/factory";
import { ClipGeneratorProxy } from "@/service/clip-generator-proxy";
import { prisma } from "@flashcast/db";
import { v4 as UUID } from "uuid";

const getBlobId = (blobName: string) =>
  `${UUID()}.${blobName.split(".").pop()}`;

export async function getUploadUrl(fileName: string, uuid: string) {
  console.log("[getUploadUrl]");
  const { blobUrl, sasUrl } = await factory.sampleService.generateSampleUrl(
    `u-${uuid}`,
    getBlobId(fileName)
  );
  return { blobUrl, sasUrl };
}

export async function submit(
  meetingTitle: string,
  recordingUrl: string,
  transcriptionUrl: string,
  aiNotes: string,
  userId: number
) {
  const sample = await factory.sampleService.createSample(
    meetingTitle,
    recordingUrl,
    transcriptionUrl,
    aiNotes,
    userId
  );

  const experiment = await factory.experimentService.createExperiment(
    userId,
    UUID(),
    "",
    undefined,
    [sample.id]
  );

  const clipGenerator = new ClipGeneratorProxy(prisma);
  await clipGenerator.startExperiment(experiment.id);

  return Promise.resolve();
}
