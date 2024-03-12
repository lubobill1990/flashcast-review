import { PrismaClient, User } from "@prisma/client";

export class UserService {
    constructor(private prisma: PrismaClient) {

    }

    async createUser(name: string, email: string): Promise<User> {
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) return existingUser;
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });

        return user;
    }
}
