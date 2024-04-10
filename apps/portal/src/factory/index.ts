import { ClipService } from "@/service/clip-service";
import { EvaluationService } from "@/service/evaluation-services";
import { prisma } from "@flashcast/db";
import { SampleService } from "@/service/sample-service";
import { UserService } from "@/service/user-service";
import { AzureBlobSASService, BlobService } from "@/service/blob-service";
import { ExperimentService } from "@/service/experiment-service";
import { SampleOutputService } from "@/service/sample-output-service";

export class ServiceFactory {
  private _blobService: BlobService | undefined;
  private _userService: UserService | undefined;
  private _sampleService: SampleService | undefined;
  private _experimentService: ExperimentService | undefined;
  private _sampleOutputService: SampleOutputService | undefined;
  private _clipService: ClipService | undefined;
  private _evaluationService: EvaluationService | undefined;
  private _azureBlobSASService: AzureBlobSASService | undefined;

  get blobService() {
    if (!this._blobService) {
      this._blobService = new BlobService();
    }
    return this._blobService;
  }

  get userService() {
    if (!this._userService) {
      this._userService = new UserService(prisma);
    }
    return this._userService;
  }

  get sampleService() {
    if (!this._sampleService) {
      this._sampleService = new SampleService(prisma, this.azureBlobSASService);
    }
    return this._sampleService;
  }

  get experimentService() {
    if (!this._experimentService) {
      this._experimentService = new ExperimentService(prisma);
    }
    return this._experimentService;
  }

  get sampleOutputService() {
    if (!this._sampleOutputService) {
      this._sampleOutputService = new SampleOutputService(prisma);
    }
    return this._sampleOutputService;
  }

  get clipService() {
    if (!this._clipService) {
      this._clipService = new ClipService(prisma, this.azureBlobSASService);
    }
    return this._clipService;
  }

  get evaluationService() {
    if (!this._evaluationService) {
      this._evaluationService = new EvaluationService(prisma);
    }
    return this._evaluationService;
  }

  get azureBlobSASService() {
    if (!this._azureBlobSASService) {
      this._azureBlobSASService = new AzureBlobSASService();
    }
    return this._azureBlobSASService;
  }
}

const factory = new ServiceFactory();

export default factory;
