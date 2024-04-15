import { PrismaClient, User } from "@flashcast/db";
import { auth } from "@flashcast/auth";

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
    const userEmail = await auth().then(
      session => session?.user?.email
    );
    if (!userEmail) throw new Error("User not found in session");

    const user = await this.getUserByEmail(userEmail);
    if (!user) throw new Error("User not found");
    console.log("getUser", user);
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
