import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
  BlobSASPermissions,
  SASProtocol,
  ContainerSASPermissions,
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

  // get a blob SAS url with read & write permission
  // can be used to preserve a url and let client to upload the corresponding file to the url
  async getBlobSASToken(
    containerName: string,
    blobName: string,
    expireSeconds = 60 * 60
  ): Promise<{
    blobUrl: string;
    sasUrl: string;
  }> {
    const containerClient = this.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const expiresOn = new Date(Date.now() + expireSeconds * 1000);
    const sasPermissions = BlobSASPermissions.parse("rw");

    const blobUrl = blobClient.url;
    const sasUrl = await blobClient.generateSasUrl({
      expiresOn,
      permissions: sasPermissions,
      protocol: SASProtocol.Https,
    });

    return {
      blobUrl,
      sasUrl,
    };
  }

  // get a container SAS url with read & write permission
  async getContainerSASToken(
    containerName: string,
    expireSeconds = 60 * 60
  ): Promise<{
    containerUrl: string;
    sasUrl: string;
  }> {
    const containerClient = this.getContainerClient(containerName);
    const expiresOn = new Date(Date.now() + expireSeconds * 1000);
    const sasPermissions = ContainerSASPermissions.parse("rw");

    const containerUrl = containerClient.url;
    const sasUrl = await containerClient.generateSasUrl({
      expiresOn,
      permissions: sasPermissions,
      protocol: SASProtocol.Https,
    });

    return {
      containerUrl,
      sasUrl,
    };
  }
}
