import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";
import { v4 as UUID } from "uuid";

const account = process.env.STORAGE_ACCOUNT || "";
const accountKey = process.env.STORAGE_ACCOUNT_KEY || "";

export class BlobService {
  private _blobServiceClient: BlobServiceClient;

  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey
    );
    const pipeline = newPipeline(sharedKeyCredential);
    this._blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      pipeline
    );
  }

  async uploadFile(containerName: string, file: File) {
    const blobName = UUID() + "." + file.name;

    const containerClient =
      this._blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.uploadData(await file.arrayBuffer());
    console.log(response);
    return `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;
  }
}

export class AzureBlobSASService {
  private blobServiceClient: BlobServiceClient;
  private sharedKeyCredential: StorageSharedKeyCredential;
  constructor() {
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey
    );
    const pipeline = newPipeline(this.sharedKeyCredential);
    this.blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      pipeline
    );
  }

  private getContainerClient(containerName: string) {
    return this.blobServiceClient.getContainerClient(containerName);
  }

  // get a SAS url for a blob in a container
  // can be used to preserve a url and let client to upload the corresponding file to the url
  async getBlobSASToken(
    containerName: string,
    blobName: string,
    expireSeconds = 60 * 60
  ): Promise<string> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const expiresOn = new Date(Date.now() + expireSeconds * 1000);
    const sasPermissions = BlobSASPermissions.parse("rw");

    const sasUrl = await blobClient.generateSasUrl({
      expiresOn,
      permissions: sasPermissions,
      protocol: SASProtocol.Https,
    });

    return sasUrl;
  }
}
