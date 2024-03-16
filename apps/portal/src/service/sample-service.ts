import { PrismaClient, Sample } from "@prisma/client";
import { getServerSession } from "next-auth";
import { BlobService } from "./blob-service";

const STORAGE_CONTAINER_NAME = "samples";

export class SampleService {
  constructor(private prisma: PrismaClient) {}

  private _blobService: BlobService | undefined;
  private get blobService() {
    if (!this._blobService) {
      this._blobService = new BlobService();
    }
    return this._blobService;
  }

  private async getUser() {
    const session = await getServerSession();
    const user = await this.prisma.user.findFirst({
      where: {
        email: session?.user?.email || "",
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  async createSample(
    data: { recording: File; transcription: File; notes: string },
    isPublic = true
  ): Promise<Sample> {
    const session = await getServerSession();

    // find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: session?.user?.email || "",
      },
    });

    if (!user) throw new Error("User not found");

    // upload file to cloud storage, and get back urls
    const recordingUploadPromise = this.blobService.uploadFile(
      STORAGE_CONTAINER_NAME,
      data.recording
    );
    const transcriptionUploadPromise = this.blobService.uploadFile(
      STORAGE_CONTAINER_NAME,
      data.transcription
    );
    const [recordingResult, transcriptionResult] = await Promise.allSettled([
      recordingUploadPromise,
      transcriptionUploadPromise,
    ]);

    if (
      recordingResult.status === "rejected" ||
      transcriptionResult.status === "rejected"
    ) {
      throw new Error("Error uploading files");
    }

    // save the sample to the database
    const sample = await this.prisma.sample.create({
      data: {
        data: {
          recording: recordingResult.value,
          recordingTitle: data.recording.name,
          transcription: transcriptionResult.value,
          notes: data.notes,
        },
        isPublic,
        userId: user?.id,
      },
    });

    console.log(sample);
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
