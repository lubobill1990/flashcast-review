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
    // TODO: remove following when API is ready to return scores
    clip.scores = {
      score: 87,
      dimensions: [
        {
          type: "intensity",
          score: 70,
          reason:
            "The participants actively discuss the issues and potential solutions, emphasizing the need to prioritize improvements and not let perfectionism hinder progress.",
        },
        {
          type: "insightful",
          score: 80,
          reason:
            "The discussion addresses specific challenges and proposes solutions for improving transcript quality and name recall in intelligent meetings.",
        },
        {
          type: "relevancy",
          score: 90,
          reason:
            "The topic directly relates to the AI notes, which mentioned the challenges and opportunities in the intelligent meetings area, including transcript quality.",
        },
      ],
    };
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
  type: "positive" | "negative",
  formdata?: any
) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("User not found");
  }
  return factory.evaluationService.submitClipEvaluation(
    clipId,
    userId,
    type,
    formdata
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
