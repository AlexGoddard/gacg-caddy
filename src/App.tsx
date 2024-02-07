import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Calcutta } from 'components/calcutta/Calcutta';
import { Dashboard } from 'components/dashboard/Dashboard';
import { Deuces } from 'components/deuces/Deuces';
import { Header } from 'components/header/Header';
import { Navbar } from 'components/navbar/Navbar';
import { Payballs } from 'components/payballs/Payballs';
import { Rounds } from 'components/round/Rounds';

import './App.css';

function App() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [navOpened, { toggle }] = useDisclosure(true);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { desktop: !navOpened, mobile: !navOpened },
          }}
          p="xl"
          withBorder={false}
        >
          <AppShell.Header>
            <Header toggle={toggle} setActiveRoute={setActiveRoute} />
          </AppShell.Header>
          <AppShell.Navbar>
            <Navbar activeRoute={activeRoute} setActiveRoute={setActiveRoute} toggle={toggle} />
          </AppShell.Navbar>
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/rounds" element={<Rounds />} />
              <Route path="/payballs" element={<Payballs />} />
              <Route path="/deuces" element={<Deuces />} />
              <Route path="/calcutta" element={<Calcutta />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
