'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { FunctionComponent, PropsWithChildren } from 'react';

export const Providers: FunctionComponent<
  PropsWithChildren<{ session?: Session }>
> = ({ children, session }) => {
  return (
    <>
      <ThemeProvider attribute='class'>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
};
