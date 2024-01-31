import { Link } from 'react-router-dom';
import { Flex, Group, GroupProps, Title, UnstyledButton } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';

import './style.less';

interface HeaderProps extends GroupProps {
  toggle: () => void;
  setActiveRoute: (routeIndex: number) => void;
}

export function Header(props: HeaderProps) {
  const { toggle, setActiveRoute, ...otherProps } = props;
  return (
    <Group justify="flex-start" align="center" gap="xs" className="headerContainer" {...otherProps}>
      <Flex>
        <UnstyledButton onClick={toggle} className="navControl" p="xs">
          <IconMenu2 />
        </UnstyledButton>
      </Flex>
      <UnstyledButton to="/" onClick={() => setActiveRoute(0)} component={Link}>
        <Title order={4} className="headerTitle">
          GACG Caddy
        </Title>
      </UnstyledButton>
    </Group>
  );
}
