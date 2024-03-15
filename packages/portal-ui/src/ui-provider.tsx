'use client';

import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';

export const UIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <FluentProvider
      theme={teamsLightTheme}
      style={{
        background: 'transparent',
      }}
    >
      {children}
    </FluentProvider>
  );
};
