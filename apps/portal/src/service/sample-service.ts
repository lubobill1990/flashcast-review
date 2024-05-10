import { PrismaClient, Sample } from "@flashcast/db";
import { AzureBlobSASService } from "./blob-service";

export class SampleService {
  constructor(
    private prisma: PrismaClient,
    private azureBlobSASService: AzureBlobSASService
  ) {}

  async generateSampleUrl(containerName: string, id: string) {
    return this.azureBlobSASService.getBlobSASToken(containerName, id);
  }

  async createSample(
    meetingTitle: string,
    recordingUrl: string,
    transcriptionUrl: string,
    aiNotes: string,
    userId: number
  ) {
    const sample = await this.prisma.sample.create({
      data: {
        data: {
          aiNotes,
        },
        isPublic: true,
        userId,
        recordingVideoUrl: recordingUrl,
        meetingTitle: meetingTitle,
        transcriptionFileUrl: transcriptionUrl,
      },
    });

    return sample;
  }

  async getSamples(userId: number): Promise<Sample[]> {
    const samples = await this.prisma.sample.findMany({
      where: {
        userId,
      },
    });
    return samples;
  }

  async getSample(id: number, userId: number) {
    const sample = await this.prisma.sample.findUniqueOrThrow({
      where: {
        id,
        userId,
      },
    });
    if (!sample) throw new Error("Sample not found");
    return sample;
  }

  async deleteSample(id: number, userId: number) {
    await this.prisma.sample.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
