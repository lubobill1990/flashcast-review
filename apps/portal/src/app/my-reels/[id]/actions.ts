"use server";

import factory from "@/factory";
import { ClipGeneratorProxy } from "@/service/clip-generator-proxy";
import { getUserId } from "@flashcast/auth";
import { prisma } from "@flashcast/db";
import axios from "axios";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type SampleOutput = ThenArg<
  ReturnType<typeof factory.sampleOutputService.getUserSampleOutputById>
>;

export async function getUser() {
  return factory.userService.getUser();
}

export async function getUserSampleOutputById(sampleOutputId: number) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("User not found");
  }
  const sampleOutput =
    await factory.sampleOutputService.getUserSampleOutputById(
      userId,
      sampleOutputId
    );
  sampleOutput.sample.recordingVideoUrl =
    factory.azureBlobSASService.generateReadOnlySasUrl(
      sampleOutput.sample.recordingVideoUrl
    );
  sampleOutput.sample.transcriptionFileUrl =
    factory.azureBlobSASService.generateReadOnlySasUrl(
      sampleOutput.sample.transcriptionFileUrl
    );
  sampleOutput.clips.forEach(clip => {
    clip.videoUrl = factory.azureBlobSASService.generateReadOnlySasUrl(
      clip.videoUrl
    );
  });
  return sampleOutput;
}

export async function submitSampleOutputEvaluation(
  sampleOutputId: number,
  score?: number,
  comment?: string
) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("User not found");
  }
  return factory.evaluationService.submitSampleOutputEvaluation(
    sampleOutputId,
    userId,
    score,
    comment
  );
}

export async function submitClipEvaluation(
  clipId: number,
  score?: number,
  comment?: string
) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("User not found");
  }
  return factory.evaluationService.submitClipEvaluation(
    clipId,
    userId,
    score,
    comment
  );
}

export async function startGenerate(sampleOutputId: number) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("User not found");
  }

  const sampleOutput =
    await factory.sampleOutputService.getUserSampleOutputById(
      userId,
      sampleOutputId
    );

  if (sampleOutput.status !== "created") {
    throw new Error("Generating has started.");
  }

  const clipGenerator = new ClipGeneratorProxy(prisma);
  return clipGenerator.startExperiment(sampleOutput.experimentId);
}
