"use client";
// import { ThemeProvider } from 'next-themes';
import { UIProvider } from "portal-ui";

import { FunctionComponent, PropsWithChildren } from "react";

export const Providers: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      {/* <ThemeProvider attribute='class'> */}
      <UIProvider>{children}</UIProvider>
      {/* </ThemeProvider> */}
    </>
  );
};
