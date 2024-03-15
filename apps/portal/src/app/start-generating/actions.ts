'use server';

import factory from "@/factory";
import { v4 as UUID } from 'uuid';

export async function submit(formData: FormData) {
  const user = await factory.userService.getUser();
  const recording = formData.get("recording") as File;
  const transcription = formData.get("transcription") as File;
  const notes = formData.get("notes") as string;

  const sample = await factory.sampleService.createSample({recording, transcription, notes});
  const experiment = await factory.experimentService.createExperiment(
    user.id,
    UUID(),
    '',
    undefined,
    [sample.id],
  );
  const sampleOutput = await factory.sampleOutputService.createSampleOutput(experiment.id, sample.id);

  // Mock the creation of 10 clips
  Promise.allSettled(new Array(10).fill(0).map(() => factory.clipService.createClip(sampleOutput.id, `sample.url/${UUID()}`)));

  return Promise.resolve(sampleOutput.id);
}
