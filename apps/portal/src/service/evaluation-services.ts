import { PrismaClient } from "@prisma/client";

export class EvaluationService {
  constructor(private prisma: PrismaClient) {}

  async createClipEvaluation(
    clipId: number,
    userId: number,
    score: number,
    comment: string,
  ) {
    return this.prisma.clipEvaluation.create({
      data: {
        clipId,
        userId,
        score,
        comment,
      },
    });
  }

  async updateClipEvaluation(
    evaluationId: number,
    score: number,
    comment: string,
  ) {
    return this.prisma.clipEvaluation.update({
      where: {
        id: evaluationId
      },
      data: {
        score,
        comment
      }
    });
  }

  async createSampleOutputEvaluation(
    sampleOutputId: number,
    userId: number,
    score: number,
    comment: string,
  ) {
    return this.prisma.sampleOutputEvaluation.create({
      data: {
        sampleOutputId,
        userId,
        score,
        comment,
      }
    });
  }

  async updateSampleOutputEvaluation(
    evaluationId: number,
    score: number,
    comment: string,
  ) {
    return this.prisma.sampleOutputEvaluation.update({
      where: {
        id: evaluationId
      },
      data: {
        score,
        comment
      }
    });
  }
}