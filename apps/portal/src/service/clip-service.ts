import { PrismaClient } from "@flashcast/db";
import { AzureBlobSASService } from "./blob-service";

const STORAGE_CONTAINER_NAME = "clips";

export class ClipService {
  constructor(
    private prisma: PrismaClient,
    private azureBlobSASService: AzureBlobSASService
  ) {}

  async createClip(sampleOutputId: number, clipUrl: string) {
    return this.prisma.clip.create({
      data: {
        sampleOutputId,
        data: {
          clipUrl,
        },
      },
    });
  }

  // usage example for processing service:
  // import { ContainerClient } from "@azure/storage-blob";
  // const containerClient = new ContainerClient(clipContainerUrl);
  // const buffer = await recording.arrayBuffer();
  // const length = buffer.byteLength;
  // const res = await containerClient.uploadBlockBlob(
  //   recordingId,
  //   buffer,
  //   length
  // );
  async getClipContainerUrl() {
    return this.azureBlobSASService.getContainerSASToken(
      STORAGE_CONTAINER_NAME
    );
  }
}
