import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { AddButton } from 'components/common/controls';
import { DEFAULT_OVERLAY } from 'components/constants';
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

      <AddButton size="xl" aria-label="Add new round" onClick={open} />
    </>
  );
}
