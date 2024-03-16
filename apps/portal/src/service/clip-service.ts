import { PrismaClient } from "@prisma/client";

export class ClipService {
  constructor(private prisma: PrismaClient) {}

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
}
