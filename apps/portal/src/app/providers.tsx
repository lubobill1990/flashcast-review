'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { FunctionComponent, PropsWithChildren } from 'react';

export const Providers: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <ThemeProvider attribute='class'>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
};
