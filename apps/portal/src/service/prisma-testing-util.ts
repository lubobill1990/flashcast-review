import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";

export class PrismaTestingUtil {
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createUser() {
    return this.prisma.user.create({
      data: {
        email: `${v4()}@test.com`,
        name: "test",
      },
    });
  }

  async deleteUser($id: number) {
    await this.prisma.user.delete({
      where: {
        id: $id,
      },
    });
  }

  async createExperiment(userId?: number) {
    if (!userId) {
      userId = (await this.createUser()).id;
    }

    return this.prisma.experiment.create({
      data: {
        name: "test",
        description: "test",
        processStatus: "created",
        userId,
        samples: [],
      },
    });
  }

  async createSample($userId?: number) {
    if (!$userId) {
      $userId = (await this.createUser()).id;
    }

    return this.prisma.sample.create({
      data: {
        userId: $userId,
        data: {
          videoFile: {
            path: "test",
            url: "test",
          },
          transcriptionFile: {
            path: "test",
            url: "test",
          },
          aiNotes: "test",
        },
      },
    });
  }
}
