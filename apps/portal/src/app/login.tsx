'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  return (
    <button onClick={() => signIn('microsoft')}>Sign in with Microsoft</button>
  );
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}

export function AuthButton() {
  const { data: session, status } = useSession();

  return (
    <div>
      {!session && <LoginButton />}
      {session && (
        <div className='flex gap-2'>
          <p>Signed in as {session.user?.name}</p>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
