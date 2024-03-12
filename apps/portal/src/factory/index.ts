import { PrismaClient } from "@prisma/client";
import { SampleService } from "@/service/sample-service";
import { UserService } from "@/service/user-service";

const pool = new Map();

export class ServiceFactory {
    constructor() {
        this.prismaClient = new PrismaClient();
    }
    prismaClient: PrismaClient;

    get sampleService() {
        if (!pool.has("sampleService")) {
            pool.set("sampleService", new SampleService(this.prismaClient));
        }
        return pool.get("sampleService");
    }
    get userService() {
        if (!pool.has("userService")) {
            pool.set("userService", new UserService(this.prismaClient));
        }
        return pool.get("userService");
    }
}

const factory = new ServiceFactory();

export default factory;
