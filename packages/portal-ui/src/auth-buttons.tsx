"use server";

import { auth, signIn, signOut } from "@flashcast/auth";

export async function LoginButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("azure-ad");
      }}
    >
      <button type="submit">Signin with Microsoft account</button>
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
      <button type="submit">Logout</button>
    </form>
  );
}

export async function AuthButton() {
  const session = await auth();

  return (
    <>
      {!session && <LoginButton />}
      {session && (
        <div className="flex gap-2">
          <p>Signed in as {session.user?.name}</p>
          <LogoutButton />
        </div>
      )}
    </>
  );
}
