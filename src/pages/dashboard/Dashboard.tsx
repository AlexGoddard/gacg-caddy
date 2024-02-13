import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { AddButton } from 'components/controls/Buttons';
import { NewRoundForm, NewRoundFormTitle } from 'pages/rounds/NewRoundForm';

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
        title={<NewRoundFormTitle />}
        size="xl"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <NewRoundForm closeModal={close} />
      </Modal>

      <AddButton size="xl" aria-label="Add new round" onClick={open} />
    </>
  );
}
