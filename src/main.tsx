import React from 'react';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import ReactDOM from 'react-dom/client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';

import App from './App.tsx';
import { theme } from './theme.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Notifications limit={3} />
      <App />
    </MantineProvider>
  </React.StrictMode>,
);

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
