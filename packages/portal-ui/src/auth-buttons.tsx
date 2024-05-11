"use server";

import { auth } from "@flashcast/auth";
import Image from "next/image";
import Link from "next/link";

export async function LoginButton() {
  return (
    <Link href="/.auth/login/aad" prefetch={false}>
      Log in
    </Link>
  );
}

export async function LogoutButton() {
  return (
    <Link href="/.auth/logout" prefetch={false}>
      Log out
    </Link>
  );
}

export async function AuthButton() {
  const session = await auth();
  return (
    <>
      {!session && <LoginButton />}
      {session && (
        <div className="flex gap-2 items-center">
          {session.user?.image && (
            <Image
              src={session.user?.image}
              width={30}
              height={30}
              alt="avatar"
              className="rounded-full"
            ></Image>
          )}
          {session.user?.name} <LogoutButton />
        </div>
      )}
    </>
  );
}
