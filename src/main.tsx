import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import App from './App.tsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
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
