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

  return Promise.resolve(sample);
}
