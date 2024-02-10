import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Header } from 'components/header/Header';
import { Navbar } from 'components/navbar/Navbar';
import { Calcutta } from 'pages/calcutta/Calcutta';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { Deuces } from 'pages/deuces/Deuces';
import { Payballs } from 'pages/payballs/Payballs';
import { Players } from 'pages/players/Players';
import { Rounds } from 'pages/rounds/Rounds';

import 'assets/global.less';

function App() {
  const queryClient = new QueryClient();
  const [activeRoute, setActiveRoute] = useState(0);
  const [navOpened, { toggle }] = useDisclosure(true);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppShell
          header={{ height: 35 }}
          navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { desktop: !navOpened, mobile: !navOpened },
          }}
          p="xl"
          withBorder={false}
        >
          <AppShell.Header>
            <Header toggle={toggle} />
          </AppShell.Header>
          <AppShell.Navbar>
            <Navbar activeRoute={activeRoute} setActiveRoute={setActiveRoute} toggle={toggle} />
          </AppShell.Navbar>
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
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
