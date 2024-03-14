import { PrismaClient } from "@prisma/client";

export class SampleOutputService {
  constructor(private prisma: PrismaClient) {}

  async createSampleOutput(experimentId: number, sampleId: number) {
    const sampleOutput = await this.prisma.sampleOutput.create({
      data: {
        experimentId,
        sampleId,
      },
    });

    return sampleOutput;
  }

  async getSampleOutput(id: number) {
    const sampleOutput = await this.prisma.sampleOutput.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return sampleOutput;
  }
}