'use server';

import factory from "@/factory";

import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';
const account = ''; // replace with your storage account name
const accountKey = ''; // replace with your storage account key
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, pipeline);
const containerName = ''; // replace with your container name

const uploadToBlobStorage = async (file: File): Promise<string> => {
  const blob = new Blob([file], { type: file.type }); 
  const blobName = Date.now() + file.name;
  console.log("uploadToBlobStorage", blobName, blob);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log(containerClient.exists());
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // fs.readFile(file);
  await blockBlobClient.uploadData(blob);
  return `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;
};

export async function submit(formData: FormData) { 
// export async function submit(_currentState: unknown, formData: FormData) { 
  const file = formData.get("recording") as File;
  const data = await uploadToBlobStorage(file);
  // const data = {
  //   recording: formData.get("recording") as File,
  //   transcription: formData.get("transcription") as File,
  //   notes: formData.get("notes") as string,
  // };

  console.log(data);
  // return factory.sampleService.createSample(data);
}
