'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  console.log('session', session, status);
  return (
    <div>
      {!session && (
        <button onClick={() => signIn('microsoft')}>
          Sign in with Microsoft
        </button>
      )}
      {session && (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
