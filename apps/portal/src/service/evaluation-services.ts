import { PrismaClient } from "@prisma/client";

export class EvaluationService {
  constructor(private prisma: PrismaClient) {}

  async submitClipEvaluation(
    clipId: number,
    userId: number,
    score?: number,
    comment?: string
  ) {
    // query existing clip evaluation
    const existingEvaluation = await this.prisma.clipEvaluation.findFirst({
      where: {
        clipId,
        userId,
      },
    });

    // update if exists
    if (existingEvaluation) {
      return this.prisma.clipEvaluation.update({
        where: {
          id: existingEvaluation.id,
        },
        data: {
          score: score ?? existingEvaluation.score,
          comment: comment ?? existingEvaluation.comment,
        },
      });
    }

    return this.prisma.clipEvaluation.create({
      data: {
        clipId,
        userId,
        score: score ?? -1,
        comment,
      },
    });
  }

  async submitSampleOutputEvaluation(
    sampleOutputId: number,
    userId: number,
    score?: number,
    comment?: string
  ) {
    // query existing sample output evaluation
    const existingEvaluation =
      await this.prisma.sampleOutputEvaluation.findFirst({
        where: {
          sampleOutputId,
          userId,
        },
      });
    // update if exists
    if (existingEvaluation) {
      return this.prisma.sampleOutputEvaluation.update({
        where: {
          id: existingEvaluation.id,
        },
        data: {
          score: score ?? existingEvaluation.score,
          comment: comment ?? existingEvaluation.comment,
        },
      });
    }
    return this.prisma.sampleOutputEvaluation.create({
      data: {
        sampleOutputId,
        userId,
        score: score ?? -1,
        comment,
      },
    });
  }
}
