'use server';

import factory from "@/factory";
import {v4 as UUID} from 'uuid';
import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';

const account = process.env.STORAGE_ACCOUNT || '';
const accountKey = process.env.STORAGE_ACCOUNT_KEY || '';
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, pipeline);
const containerName = 'samples'; // replace with your container name

const uploadToBlobStorage = async (file: File): Promise<string> => {
  const blobName = UUID() + '.' + file.name;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const response = await blockBlobClient.uploadData(await file.arrayBuffer());
  console.log(response);
  return `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;
};

export async function submit(formData: FormData) {
  const sampleData = {
    recording: '',
    transcription: '',
    notes: formData.get("notes") as string,
  }
// export async function submit(_currentState: unknown, formData: FormData) { 
  const recordingFile = formData.get("recording") as File;
  const uploadRecordingPromise = uploadToBlobStorage(recordingFile).then(url => sampleData.recording = url);
  const transcriptionFile = formData.get("transcription") as File;
  const uploadTranscriptionPromise = uploadToBlobStorage(transcriptionFile).then(url => sampleData.transcription = url);

  const result = await Promise.allSettled([uploadRecordingPromise, uploadTranscriptionPromise]);
  const hasError = result.some(promise => promise.status === 'rejected');

  if (hasError) {
    console.log('Error uploading files');
    return;
  }
  console.log(sampleData);
  return factory.sampleService.createSample(sampleData);
}
