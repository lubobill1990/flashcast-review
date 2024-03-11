/**
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client';
import { ExperimentService } from './experiment-service';

describe('ExperimentService', () => {
  it('', async () => {
    const prismaClient = new PrismaClient();
    let user = await prismaClient.user.findFirst({
      where: {
        email: 'diw@fiwe.ci',
      },
    });

    if (user === null) {
      user = await prismaClient.user.create({
        data: {
          email: 'diw@fiwe.ci',
          name: 'xxfwe',
        },
      });
    }

    const service = new ExperimentService(prismaClient);
    const exp = await service.createExperiment(
      user.id,
      'name',
      'description',
      {}
    );
    expect(exp).toBeDefined();
    expect(exp.id).toBeDefined();
    console.log(exp.id);
  });
});
