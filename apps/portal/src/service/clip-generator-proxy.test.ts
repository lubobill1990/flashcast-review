/**
 * @jest-environment node
 */

import { ClipGeneratorProxy } from "./clip-generator-proxy";
import axios from "axios";
import { PrismaTestingUtil } from "./prisma-testing-util";
import { prisma } from "@flashcast/db";

let queueExtractJob = jest.fn();

describe("ClipGeneratorProxy", () => {
  let service: ClipGeneratorProxy;
  let prismaTest: PrismaTestingUtil;

  beforeEach(() => {
    prismaTest = new PrismaTestingUtil(prisma);
    const client = axios.create({
      baseURL: "http://localhost:5000",
    });
    service = new ClipGeneratorProxy(prisma);
  });
  it("", async () => {
    const exp = await prismaTest.createExperiment();
    const sample1 = await prismaTest.createSample();
    const sample2 = await prismaTest.createSample();
    const sample3 = await prismaTest.createSample();
    const sampleIds = [sample1.id, sample2.id, sample3.id];
    await prisma.experiment.update({
      where: {
        id: exp.id,
      },
      data: {
        samples: sampleIds,
      },
    });

    await service.startExperiment(exp.id);
    expect(queueExtractJob).toHaveBeenCalledTimes(3);
  });
});
