import { PrismaClient } from "@flashcast/db";

export class SampleOutputService {
  constructor(private prisma: PrismaClient) {}

  async createSampleOutput(experimentId: number, sampleId: number) {
    return this.prisma.sampleOutput.create({
      data: {
        experimentId,
        sampleId,
      },
    });
  }

  async getSampleOutputsByUserId(userId: number) {
    return this.prisma.sampleOutput.findMany({
      where: {
        sample: { userId },
      },
      include: {
        sample: true,
        clips: true,
      },
    });
  }

  async getUserSampleOutputById(userId: number, sampleOutputId: number) {
    return this.prisma.sampleOutput.findUniqueOrThrow({
      where: {
        id: sampleOutputId,
      },
      include: {
        experiment: true,
        evaluations: {
          where: {
            userId,
          },
        },
        sample: true,
        clips: {
          include: {
            evaluations: true,
          },
        },
      },
    });
  }
}
