import { auth } from "./auth";
import { toInteger } from "lodash-es";
import { prisma } from "@flashcast/db";

export async function getUserId(): Promise<number | undefined> {
  const session = await auth();
  if (session?.user?.id) {
    return toInteger(session.user.id);
  }

  return undefined;
}

export async function getUser() {
  const userId = await getUserId();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return user;
}

export const getAccount = (provider: string, providerAccountId: string) => {
  return prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });
};

export const createAccount = async (
  provider: string,
  providerAccountId: string,
  name: string,
  email: string
) => {
  const user = await prisma.user.create({ data: { name, email } });
  return prisma.account.create({
    data: {
      provider,
      providerAccountId,
      userId: user.id,
      type: "oidc",
    },
    include: { user: true },
  });
};
