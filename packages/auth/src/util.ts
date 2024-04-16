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
