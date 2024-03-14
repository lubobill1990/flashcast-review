'use server';

import factory from "@/factory";

export async function submit(formData: FormData) {
  const sampleData = {
    recording: '',
    transcription: '',
    notes: formData.get("notes") as string,
  }
  const recording = formData.get("recording") as File;
  const transcription = formData.get("transcription") as File;
  const notes = formData.get("notes") as string;

  console.log('sample submitted:', sampleData);
  return factory.sampleService.createSample({recording, transcription, notes});
}
