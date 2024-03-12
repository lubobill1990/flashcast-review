'use server';

import factory from "@/factory";

export async function submit(_currentState: unknown, formData: FormData) { 

  const data = {
    recording: formData.get("recording") as File,
    transcription: formData.get("transcription") as File,
    notes: formData.get("notes") as string,
  };

  console.log(data);
  return factory.sampleService.createSample(data);
}
