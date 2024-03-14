import { BlobServiceClient, StorageSharedKeyCredential, newPipeline } from '@azure/storage-blob';
import {v4 as UUID} from 'uuid';

const account = process.env.STORAGE_ACCOUNT || '';
const accountKey = process.env.STORAGE_ACCOUNT_KEY || '';

export class BlobService {
  private _blobServiceClient: BlobServiceClient;

  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const pipeline = newPipeline(sharedKeyCredential);
    this._blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, pipeline);
  }

  async uploadFile(containerName: string, file: File) {
    const blobName = UUID() + '.' + file.name;
  
    const containerClient = this._blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.uploadData(await file.arrayBuffer());
    console.log(response);
    return `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;
  }
}