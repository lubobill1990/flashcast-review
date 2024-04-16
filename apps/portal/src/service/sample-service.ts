import { PrismaClient, Sample } from "@flashcast/db";
import { auth } from "@flashcast/auth";
import { AzureBlobSASService } from "./blob-service";

const STORAGE_CONTAINER_NAME = "samples";

export class SampleService {
  constructor(
    private prisma: PrismaClient,
    private azureBlobSASService: AzureBlobSASService
  ) {}

  private async getUser() {
    const session = await auth();
    const user = await this.prisma.user.findFirst({
      where: {
        email: session?.user?.email || "",
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  async generateSampleUrl(containerName: string, id: string) {
    return this.azureBlobSASService.getBlobSASToken(containerName, id);
  }

  async createSample(
    recordingUrl: string,
    transcriptionUrl: string,
    notes: string
  ) {
    const user = await this.getUser();
    const sample = await this.prisma.sample.create({
      data: {
        data: {
          recording: recordingUrl,
          transcription: transcriptionUrl,
          notes,
        },
        isPublic: true,
        userId: user.id,
      },
    });

    return sample;
  }

  async getSamples(): Promise<Sample[]> {
    const user = await this.getUser();
    const samples = await this.prisma.sample.findMany({
      where: {
        userId: user.id,
      },
    });
    return samples;
  }

  async getSample(id: number) {
    const user = await this.getUser();
    const sample = await this.prisma.sample.findUniqueOrThrow({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!sample) throw new Error("Sample not found");
    return sample;
  }

  async deleteSample(id: number) {
    const user = await this.getUser();
    await this.prisma.sample.delete({
      where: {
        id,
        userId: user.id,
      },
    });
  }
}
