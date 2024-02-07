import { ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';

import { DEFAULT_GRADIENT, DEFAULT_OVERLAY } from 'components/constants';
import { NewRound, NewRoundTitle } from 'components/round/NewRound';
import { useDevice } from 'components/util';

export function Dashboard() {
  const [opened, { open, close }] = useDisclosure(false);
  const { isMobile } = useDevice();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<NewRoundTitle />}
        size="xl"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <NewRound closeModal={close} />
      </Modal>

      <ActionIcon
        variant="gradient"
        size="xl"
        aria-label="Add new round"
        gradient={DEFAULT_GRADIENT}
        onClick={open}
      >
        <IconPlus />
      </ActionIcon>
    </>
  );
}
