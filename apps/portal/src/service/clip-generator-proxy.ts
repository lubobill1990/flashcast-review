import { PrismaClient, Sample, SampleOutput } from "@flashcast/db";
import jwt from "jsonwebtoken";
import factory from "@/factory";
import axios from "axios";

const clipGeneratorApiUrl = process.env.CLIP_GENERATOR_API_URL as string;

export class ClipGeneratorProxy {
  constructor(private prisma: PrismaClient) {}

  async startExperiment(experimentId: number) {
    const experiment = await this.prisma.experiment.findFirstOrThrow({
      where: {
        id: experimentId,
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
        await this.startSampleGenerating(sampleOutput, sampleOutput.sample);
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

  async startSampleGenerating(sampleOutput: SampleOutput, sample: Sample) {
    const recording = factory.azureBlobSASService.generateReadOnlySasUrl(
      sample.recordingVideoUrl
    );
    const transcript = factory.azureBlobSASService.generateReadOnlySasUrl(
      sample.transcriptionFileUrl
    );
    const aiNotes = (sample.data as any).aiNotes;
    const { sasUrl: containerRWSasUrl } =
      await factory.azureBlobSASService.getContainerSASToken(
        `so-${sampleOutput.id}`,
        60 * 60 * 24 * 7
      );

    const data = {
      recording,
      transcript,
      extra_prompt: aiNotes,
      webhooks: {
        onNewFile: {
          url: containerRWSasUrl,
        },
        onStatusChange: {
          url: this.getApiUrl(
            `/sample-output/${sampleOutput.id}/status`,
            sampleOutput
          ),
        },
        onNewClip: {
          url: this.getApiUrl(
            `/sample-output/${sampleOutput.id}/clip`,
            sampleOutput
          ),
        },
      },
      useCache: true,
    };

    await axios.post(clipGeneratorApiUrl, data);
  }
}
