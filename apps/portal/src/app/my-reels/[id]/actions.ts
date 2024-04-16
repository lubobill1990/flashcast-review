"use server";

import factory from "@/factory";
import { getUserId } from "@flashcast/auth";
import { sample } from "lodash-es";

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
  (sampleOutput.sample.data as any).recording =
    factory.azureBlobSASService.generateReadOnlySasUrl(
      (sampleOutput.sample.data as any).recording
    );
  (sampleOutput.sample.data as any).transcription =
    factory.azureBlobSASService.generateReadOnlySasUrl(
      (sampleOutput.sample.data as any).transcription
    );
  sampleOutput.clips.forEach(clip => {
    (clip.data as any).clipUrl =
      factory.azureBlobSASService.generateReadOnlySasUrl(
        (clip.data as any).clipUrl
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
