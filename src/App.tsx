import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Dashboard } from 'components/dashboard/Dashboard';
import { Header } from 'components/header/Header';
import { Navbar } from 'components/navbar/Navbar';
import { Payballs } from 'components/payballs/Payballs';

import './App.css';

function App() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [navOpened, { toggle }] = useDisclosure(true);

  return (
    <BrowserRouter>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: 'sm',
          collapsed: { desktop: !navOpened, mobile: !navOpened },
        }}
        padding="xl"
        withBorder={false}
      >
        <AppShell.Header>
          <Header toggle={toggle} setActiveRoute={setActiveRoute} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Navbar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payballs" element={<Payballs />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
