"use server";

import { auth } from "@flashcast/auth";
import Image from "next/image";
import { Button } from "@fluentui/react-components";

export async function LoginButton() {
  return <Button href="/.auth/login/aad">Log in</Button>;
}

export async function LogoutButton() {
  return <Button href="/.auth/logout">Log out</Button>;
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
