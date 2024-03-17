"use server";

import factory from "@/factory";

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type SampleOutput = ThenArg<
  ReturnType<typeof factory.sampleOutputService.getUserSampleOutputById>
>;

export async function getUser() {
  return factory.userService.getUser();
}

export async function getUserSampleOutputById(
  userId: number,
  sampleOutputId: number
) {
  return factory.sampleOutputService.getUserSampleOutputById(
    userId,
    sampleOutputId
  );
}

export async function submitSampleOutputEvaluation(
  sampleOutputId: number,
  userId: number,
  score?: number,
  comment?: string
) {
  return factory.evaluationService.submitSampleOutputEvaluation(
    sampleOutputId,
    userId,
    score,
    comment
  );
}

export async function submitClipEvaluation(
  clipId: number,
  userId: number,
  score?: number,
  comment?: string
) {
  return factory.evaluationService.submitClipEvaluation(
    clipId,
    userId,
    score,
    comment
  );
}
