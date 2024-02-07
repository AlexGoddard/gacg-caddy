import { Link } from 'react-router-dom';

import { NavLink } from '@mantine/core';
import {
  IconCurrencyDollar,
  IconGolf,
  IconHome,
  IconPlayCard,
  IconTrophy,
  IconUser,
} from '@tabler/icons-react';

import { useDevice } from 'components/util';

interface NavbarProps {
  activeRoute: number;
  setActiveRoute: (routeIndex: number) => void;
  toggle: () => void;
}

export function Navbar(props: NavbarProps) {
  const { activeRoute, setActiveRoute, toggle } = props;
  const { isMobile } = useDevice();

  const navLinks = [
    { icon: IconHome, href: '/', label: 'Dashboard' },
    { icon: IconUser, href: '/players', label: 'Players' },
    { icon: IconGolf, href: '/rounds', label: 'Rounds' },
    { icon: IconCurrencyDollar, href: '/payballs', label: 'Payballs' },
    { icon: IconPlayCard, href: '/deuces', label: 'Deuces' },
    { icon: IconTrophy, href: '/calcutta', label: 'Calcutta' },
  ];

  const links = navLinks.map((link, index) => (
    <NavLink
      key={link.label}
      to={link.href}
      label={link.label}
      active={index === activeRoute}
      leftSection={<link.icon />}
      onClick={() => {
        if (isMobile) toggle();
        setActiveRoute(index);
      }}
      variant="light"
      component={Link}
    />
  ));

  return <>{links}</>;
}
