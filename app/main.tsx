import React from 'react';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { createRoot } from 'react-dom/client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';

import App from './App';
import { theme } from './theme';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Notifications limit={3} />
        <App />
      </MantineProvider>
    </React.StrictMode>,
  );
}
