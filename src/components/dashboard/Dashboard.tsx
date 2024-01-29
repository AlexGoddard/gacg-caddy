import { ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { NewRound, NewRoundTitle } from 'components/round/NewRound';

export function Dashboard() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<NewRoundTitle />}
        size="xl"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <NewRound closeModal={close} />
      </Modal>

      <ActionIcon
        variant="gradient"
        size="xl"
        aria-label="Add new round"
        gradient={{ from: 'indigo', to: 'teal', deg: 150 }}
        onClick={open}
      >
        <IconPlus />
      </ActionIcon>
    </>
  );
}
