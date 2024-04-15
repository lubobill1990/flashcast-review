"use server";

import { auth, signIn, signOut } from "@flashcast/auth";
import Image from "next/image";

export async function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("azure-ad");
      }}
    >
      <button type="submit">Sign in with Microsoft account</button>
    </form>
  );
}

export async function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <button type="submit">Log out</button>
    </form>
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
