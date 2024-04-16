import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
  BlobSASPermissions,
  SASProtocol,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
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

  private async getContainerClient(containerName: string) {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    if (!(await containerClient.exists())) {
      await containerClient.create();
    }
    return containerClient;
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
    const containerClient = await this.getContainerClient(containerName);
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
    const containerClient = await this.getContainerClient(containerName);
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
  
  generateReadOnlySasUrl(storageUrl: string) {
    const url = new URL(storageUrl);
    const pathParts = url.pathname.split("/");
    const containerName = pathParts[1];
    const blobName = pathParts.slice(2).join("/");

    // Define SAS permissions for the blob
    // In this case, 'r' indicates read permissions
    const permissions = BlobSASPermissions.parse("r");

    // Define the SAS token's expiration time
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour from now

    // Generate the SAS token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        expiresOn,
      },
      this.sharedKeyCredential
    ).toString();

    // Construct the full URL with the SAS token
    const blobUrl = this.blobServiceClient
      .getContainerClient(containerName)
      .getBlobClient(blobName).url;

    return `${blobUrl}?${sasToken}`;
  }
}
