/**
 * @jest-environment node
 */

import { ExperimentService } from "./experiment-service";
import { prisma } from "@flashcast/db";

describe("ExperimentService", () => {
  it("", async () => {
    let user = await prisma.user.findFirst({
      where: {
        email: "diw@fiwe.ci",
      },
    });

    if (user === null) {
      user = await prisma.user.create({
        data: {
          email: "diw@fiwe.ci",
          name: "xxfwe",
        },
      });
    }

    const service = new ExperimentService(prisma);
    const exp = await service.createExperiment(
      user.id,
      "name",
      "description",
      {},
      []
    );
    expect(exp).toBeDefined();
    expect(exp.id).toBeDefined();
    console.log(exp.id);
  });
});
