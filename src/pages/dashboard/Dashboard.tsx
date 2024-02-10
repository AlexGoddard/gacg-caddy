import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { AddButton } from 'components/controls/Buttons';
import { NewRound, NewRoundTitle } from 'pages/rounds/NewRound';

import { DEFAULT_OVERLAY } from 'data/constants';

import { useDevice } from 'hooks/useDevice';

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

      <AddButton size="xl" aria-label="Add new round" onClick={open} />
    </>
  );
}
