import { PrismaClient, User } from "@flashcast/db";
import { auth } from "@flashcast/auth";
import { toInteger } from "lodash-es";

export class UserService {
  constructor(private prisma: PrismaClient) {}

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

  async getUser() {
    const session = await auth();
    const id = session?.user?.id;
    if (!id) throw new Error("Session not found");
    const user = await this.prisma.user.findFirst({
      where: {
        id: toInteger(id),
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
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
