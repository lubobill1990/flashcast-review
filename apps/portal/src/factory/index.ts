import { PrismaClient } from "@prisma/client";
import { SampleService } from "@/service/sample-service";
import { UserService } from "@/service/user-service";

export class ServiceFactory {
    constructor() {
        this._prismaClient = new PrismaClient();
    }
    _prismaClient: PrismaClient;
    _sampleService: SampleService | undefined;
    _userService: UserService | undefined;

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
}

const factory = new ServiceFactory();

export default factory;
