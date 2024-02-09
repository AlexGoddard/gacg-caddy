import { Flex, Group, GroupProps, UnstyledButton, rem } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';

import './style.less';

interface HeaderProps extends GroupProps {
  toggle: () => void;
}

export function Header(props: HeaderProps) {
  const { toggle, ...otherProps } = props;
  const [scroll] = useWindowScroll();

  return (
    <Group
      justify="space-between"
      align="center"
      className={`headerContainer${scroll.y > 0 ? ' headerShadow' : ''}`}
      {...otherProps}
    >
      <Group gap="xs">
        <Flex>
          <UnstyledButton c="slate.1" onClick={toggle} className="navControl" h="35px">
            <IconMenu2 style={{ width: rem(50), height: rem(20) }} />
          </UnstyledButton>
        </Flex>
      </Group>
    </Group>
  );
}
