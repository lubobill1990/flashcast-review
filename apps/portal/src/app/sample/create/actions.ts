'use server';

import factory from "@/factory";

const containerName = 'samples';

export async function submit(formData: FormData) {
  const blobService = factory.blobService;
  const sampleData = {
    recording: '',
    transcription: '',
    notes: formData.get("notes") as string,
  }
  const recordingFile = formData.get("recording") as File;
  const uploadRecordingPromise = blobService.uploadFile(containerName, recordingFile)
    .then(url => sampleData.recording = url);
  const transcriptionFile = formData.get("transcription") as File;
  const uploadTranscriptionPromise = blobService.uploadFile(containerName, transcriptionFile)
    .then(url => sampleData.transcription = url);

  const result = await Promise.allSettled([uploadRecordingPromise, uploadTranscriptionPromise]);
  const hasError = result.some(promise => promise.status === 'rejected');

  if (hasError) {
    console.log('Error uploading files');
    return;
  }
  console.log('sample submitted:', sampleData);
  return factory.sampleService.createSample(sampleData);
}
