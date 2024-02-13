import React from 'react';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as testingLibraryRender } from '@testing-library/react';

import { theme } from '../src/theme';

export function render(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MantineProvider>
    ),
  });
}
