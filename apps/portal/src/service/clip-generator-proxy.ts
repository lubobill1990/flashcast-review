import { PrismaClient, SampleOutput } from "@flashcast/db";
import jwt from "jsonwebtoken";
import { IApiService } from "./interface";

export class ClipGeneratorProxy {
  constructor(private apiService: IApiService, private prisma: PrismaClient) {}

  async startExperiment($experimentId: number) {
    const experiment = await this.prisma.experiment.findFirstOrThrow({
      where: {
        id: $experimentId,
      },
    });

    if (experiment.processStatus !== "created") {
      throw new Error("Experiment is already started");
    }

    const sampleIds = experiment.samples as number[];

    const sampleOutputs = await Promise.all(
      (
        await this.prisma.sample.findMany({
          where: {
            id: {
              in: sampleIds,
            },
          },
        })
      ).map(
        async sample =>
          await this.prisma.sampleOutput.create({
            data: {
              sampleId: sample.id,
              experimentId: experiment.id,
            },
            include: {
              sample: true,
            },
          })
      )
    );

    // update experiment status
    await this.prisma.experiment.update({
      where: {
        id: experiment.id,
      },
      data: {
        processStatus: "started",
      },
    });

    return Promise.all(
      sampleOutputs.map(async sampleOutput => {
        const sample = sampleOutput.sample;
        const data = sample.data as any;
        const videoFile = data.videoFile;
        const transcriptionFile = data.transcriptionFile;
        const aiNotes = data.aiNotes;

        await this.apiService.queueExtractJob({
          jobId: `extract-${sampleOutput.id}`,
          sampleId: sample.id,
          experimentId: experiment.id,
          parameters: experiment.parameters,
          videoFile,
          transcriptionFile,
          aiNotes,
          createdAt: new Date(),
          webhooks: {
            onNewClip: {
              method: "post",
              url: this.getApiUrl(
                `/sample-output/${sampleOutput.id}/clip`,
                sampleOutput
              ),
              params: {
                name: "string",
                description: "string",
                tags: ["string"],
                startTime: "number",
                endTime: "number",
                file: "File",
              },
            },
            onStatusChange: {
              method: "post",
              url: this.getApiUrl(
                `/sample-output/${sampleOutput.id}/status`,
                sampleOutput
              ),
              params: {
                status: "string",
              },
            },
          },
        });
      })
    );
  }

  private getApiUrl(path: string, sampleOutput: SampleOutput) {
    const endpoint = process.env.NEXT_PUBLIC_API_URL + path;
    const token = jwt.sign(
      {
        iss: "flashcast",
        id: sampleOutput.id,
        sampleId: sampleOutput.sampleId,
        experimentId: sampleOutput.experimentId,
        endpoint,
      },
      sampleOutput.jwtSecret,
      { expiresIn: "24h" }
    );
    const url = new URL(endpoint);
    url.searchParams.append("token", token);

    return url.toString();
  }
}
