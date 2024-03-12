/**
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';
import { ClipGeneratorProxy } from './clip-generator-proxy';
import { ApiService } from './api-service';
import axios from 'axios';
import { PrismaTestingUtil } from './prisma-testing-util';

let queueExtractJob = jest.fn();
// mock ApiService
// jest.mock('./api-service', () => {
//   return {
//     ApiService: jest.fn().mockImplementation(() => {
//       return {
//         queueExtractJob,
//       };
//     }),
//   };
// });
describe('ClipGeneratorProxy', () => {
  let service: ClipGeneratorProxy;
  let prismaTest: PrismaTestingUtil;
  let prismaClient: PrismaClient;
  beforeEach(() => {
    prismaClient = new PrismaClient();
    prismaTest = new PrismaTestingUtil(prismaClient);
    const client = axios.create({
      baseURL: 'http://localhost:5000',
    });
    const apiService = new ApiService(client);
    service = new ClipGeneratorProxy(apiService, prismaClient);
  });
  it('', async () => {
    const exp = await prismaTest.createExperiment();
    const sample1 = await prismaTest.createSample();
    const sample2 = await prismaTest.createSample();
    const sample3 = await prismaTest.createSample();
    const sampleIds = [sample1.id, sample2.id, sample3.id];
    await prismaClient.experiment.update({
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
