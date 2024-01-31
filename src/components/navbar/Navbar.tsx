import { Link } from 'react-router-dom';
import { NavLink } from '@mantine/core';
import { IconCurrencyDollar, IconHome, IconPlayCard, IconTrophy } from '@tabler/icons-react';

interface NavbarProps {
  activeRoute: number;
  setActiveRoute: (routeIndex: number) => void;
}

export function Navbar(props: NavbarProps) {
  const { activeRoute, setActiveRoute } = props;

  const navLinks = [
    { icon: IconHome, href: '/', label: 'Dashboard' },
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
      onClick={() => setActiveRoute(index)}
      variant="subtle"
      component={Link}
    />
  ));

  return <>{links}</>;
}
