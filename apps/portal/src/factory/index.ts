import { PrismaClient } from "@prisma/client";
import { SampleService } from "@/service/sample-service";
import { UserService } from "@/service/user-service";
import { BlobService } from "@/service/blob-service";
import { ExperimentService } from "@/service/experiment-service";
import { SampleOutputService } from "@/service/sample-output-service";
import { ClipService } from "@/service/clip-service";
import { EvaluationService } from "@/service/evaluation-services";

export class ServiceFactory {
  private _prismaClient: PrismaClient;
  private _blobService: BlobService | undefined;
  private _userService: UserService | undefined;
  private _sampleService: SampleService | undefined;
  private _experimentService: ExperimentService | undefined;
  private _sampleOutputService: SampleOutputService | undefined;
  private _clipService: ClipService | undefined;
  private _evaluationService: EvaluationService | undefined;

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  get prismaClient() {
    return this._prismaClient;
  }

  get blobService() {
    if(!this._blobService) {
      this._blobService = new BlobService();
    }
    return this._blobService;
  }

  get userService() {
    if(!this._userService) {
      this._userService = new UserService(this._prismaClient);
    }
    return this._userService;
  }

  get sampleService() {
    if(!this._sampleService) {
      this._sampleService = new SampleService(this._prismaClient);
    }
    return this._sampleService;
  }

  get experimentService() {
    if(!this._experimentService) {
      this._experimentService = new ExperimentService(this._prismaClient);
    }
    return this._experimentService;
  }

  get sampleOutputService() {
    if(!this._sampleOutputService) {
      this._sampleOutputService = new SampleOutputService(this._prismaClient);
    }
    return this._sampleOutputService;
  }

  get clipService() {
    if(!this._clipService) {
      this._clipService = new ClipService(this._prismaClient);
    }
    return this._clipService;
  }

  get evaluationService() {
    if(!this._evaluationService) {
      this._evaluationService = new EvaluationService(this._prismaClient);
    }
    return this._evaluationService;
  }
}

const factory = new ServiceFactory();

export default factory;
