import { PrismaClient, Sample } from "@flashcast/db";

export class ExperimentService {
  constructor(private prisma: PrismaClient) {}

  async createExperiment(
    userId: number,
    name: string,
    description: string,
    parameters: any,
    sampleIds: number[]
  ) {
    const newExperiment = await this.prisma.experiment.create({
      data: {
        name,
        description,
        processStatus: "created",
        userId,
        parameters,
        samples: sampleIds,
      },
    });

    return newExperiment;
  }

  async forkExperiment($fromId: number) {
    // query the from experiment
    const fromExperiment = await this.prisma.experiment.findFirstOrThrow({
      where: {
        id: $fromId,
      },
    });

    // get forkToExperiments count
    const forkToExperimentsCount = await this.prisma.experiment.count({
      where: {
        forkFromExperimentId: fromExperiment.id,
      },
    });

    // create a new experiment
    const newExperiment = await this.prisma.experiment.create({
      data: {
        name: `${fromExperiment.name} - Fork ${forkToExperimentsCount + 1}`,
        description: fromExperiment.description,
        processStatus: "created",
        parameters: fromExperiment.parameters!,
        userId: fromExperiment.userId,
        samples: fromExperiment.samples!,
      },
    });

    return newExperiment;
  }

  async deleteExperiment($id: number) {
    await this.prisma.experiment.delete({
      where: {
        id: $id,
      },
    });
  }

  async getAllExperiments(userId: number) {
    return await this.prisma.experiment.findMany({
      where: {
        userId,
      },
    });
  }
}
