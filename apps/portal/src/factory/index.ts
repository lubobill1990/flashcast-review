import { PrismaClient } from "@prisma/client";
import { SampleService } from "@/service/sample-service";
import { UserService } from "@/service/user-service";
import { BlobService } from "@/service/blob-service";

export class ServiceFactory {
  constructor() {
    this._prismaClient = new PrismaClient();
  }
  private _prismaClient: PrismaClient;
  private _sampleService: SampleService | undefined;
  private _userService: UserService | undefined;
  private _blobService: BlobService | undefined;

  get sampleService() {
    if(!this._sampleService) {
      this._sampleService = new SampleService(this._prismaClient);
    }
    return this._sampleService;
  }

  get userService() {
    if(!this._userService) {
      this._userService = new UserService(this._prismaClient);
    }
    return this._userService;
  }

  get blobService() {
    if(!this._blobService) {
      this._blobService = new BlobService();
    }
    return this._blobService;
  }
}

const factory = new ServiceFactory();

export default factory;
