import { useState } from 'react';

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  Text,
  rem,
} from '@mantine/core';
import { useDisclosure, useFocusTrap } from '@mantine/hooks';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';
import { AddButton } from 'components/controls/Buttons';
import { PlayerInfo } from 'components/display/PlayerInfo';
import { PlayerScorecard } from 'components/display/PlayerScorecard';
import { SectionTitle } from 'components/display/typography/SectionTitle';

import { DEFAULT_OVERLAY, ScoreType, TournamentDay } from 'data/constants';

import { useDeletePlayer } from 'hooks/players/useDeletePlayer';
import { usePlayers } from 'hooks/players/usePlayers';
import { useDevice } from 'hooks/useDevice';

import { CalcuttaPartner } from './CalcuttaPartner';
import { EditPlayerForm, EditPlayerFormTitle } from './EditPlayerForm';
import { NewPlayerForm, NewPlayerFormTitle } from './NewPlayerForm';
import { PlayerRound } from './PlayerRound';
import './style.less';

export function Players() {
  const focusTrapRef = useFocusTrap();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>('');
  const [newPlayerFormOpened, { open: newPlayerFormOpen, close: newPlayerFormClose }] =
    useDisclosure(false);
  const [editPlayerFormOpened, { open: editPlayerFormOpen, close: editPlayerFormClose }] =
    useDisclosure(false);
  const [deleteConfirmOpened, { open: deleteConfirmOpen, close: deleteConfirmClose }] =
    useDisclosure(false);

  const { isMobile } = useDevice();
  const { isSuccess, data } = usePlayers();
  const deletePlayerMutation = useDeletePlayer();

  const players = isSuccess ? data : [];

  const selectedPlayer = players.find((player) => player.id === Number(selectedPlayerId));

  const delPlayer = () => {
    const loadingNotification = notifications.loading('Deleting player..');

    deletePlayerMutation.mutate(Number(selectedPlayerId), {
      onSettled: (response) => {
        if (response) {
          notifications.updateSuccess(loadingNotification, 'Deleted player');
        } else {
          notifications.updateFailure(loadingNotification, 'Failed to delete player');
        }
      },
    });
    setSelectedPlayerId(null);
    deleteConfirmClose();
  };

  const PlayerMenu = () => (
    <Menu shadow="md" position="left-start">
      <Menu.Target>
        <ActionIcon variant="subtle" color="dimmed" size="xl">
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Player Settings</Menu.Label>
        <Menu.Item
          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
          onClick={editPlayerFormOpen}
        >
          Edit player info
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
          onClick={deleteConfirmOpen}
        >
          Delete player
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      <Modal
        opened={newPlayerFormOpened}
        onClose={newPlayerFormClose}
        title={<NewPlayerFormTitle />}
        size="sm"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <NewPlayerForm closeModal={newPlayerFormClose} setActivePlayer={setSelectedPlayerId} />
      </Modal>
      <Modal
        opened={editPlayerFormOpened}
        onClose={editPlayerFormClose}
        title={<EditPlayerFormTitle />}
        size="sm"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <EditPlayerForm player={selectedPlayer!} closeModal={editPlayerFormClose} />
      </Modal>
      <Modal
        opened={deleteConfirmOpened}
        onClose={deleteConfirmClose}
        title="Confirm Deletion"
        size="md"
        overlayProps={DEFAULT_OVERLAY}
      >
        <Stack>
          <Text>
            Are you sure you want to delete {selectedPlayer?.fullName}? Deleting players removes all
            of their saved rounds.{' '}
            <Text span c="blush.6" fw="bold">
              This action is irreversible
            </Text>
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={deleteConfirmClose}>
              Cancel
            </Button>
            <Button color="blush.6" leftSection={<IconTrash size={14} />} onClick={delPlayer}>
              Delete Player
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Stack gap="xl" ref={focusTrapRef}>
        <Group>
          <Select
            size="xl"
            placeholder="Search Players"
            data={players.map((player) => ({
              value: player.id.toString(),
              label: player.fullName,
            }))}
            value={selectedPlayerId}
            onChange={setSelectedPlayerId}
            searchable
            selectFirstOptionOnChange
            rightSection={<AddButton size="xl" onClick={newPlayerFormOpen} />}
            rightSectionPointerEvents="auto"
            className="playerSearch"
          />
        </Group>
        {selectedPlayer && (
          <Paper bg="slate.8" p="xl" shadow="lg">
            <Stack gap="xl">
              <Group justify="space-between" align="flex-start">
                <PlayerInfo player={selectedPlayer} size="xl" />
                <PlayerMenu />
              </Group>
              <Divider />
              <Stack>
                <Group ta="left" gap="xl" align="stretch">
                  <Stack gap="xl">
                    <SectionTitle>Rounds</SectionTitle>
                    <Group align="flex-end">
                      <PlayerRound day={TournamentDay.FRIDAY} playerId={selectedPlayer.id} />
                      <PlayerRound day={TournamentDay.SATURDAY} playerId={selectedPlayer.id} />
                      <PlayerRound day={TournamentDay.SUNDAY} playerId={selectedPlayer.id} />
                    </Group>
                  </Stack>
                </Group>
              </Stack>
              <Divider />
              <Stack align="flex-start">
                <SectionTitle>Calcutta Partner</SectionTitle>
                <CalcuttaPartner player={selectedPlayer} />
              </Stack>
              <Divider />
              <Stack gap="xs">
                <SectionTitle>Scorecards</SectionTitle>
                <Paper p="xs" shadow="md">
                  <Tabs
                    defaultValue="gross"
                    keepMounted={false}
                    classNames={{ list: 'tabs', tab: 'tab' }}
                  >
                    <Tabs.List>
                      <Tabs.Tab value="gross" fz="md">
                        Gross
                      </Tabs.Tab>
                      <Tabs.Tab value="net" fz="md">
                        Net
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="gross">
                      <ScrollArea maw="100%">
                        <PlayerScorecard
                          day={TournamentDay.ALL}
                          scoreType={ScoreType.GROSS}
                          player={{ id: selectedPlayer.id, name: selectedPlayer.fullName }}
                          fz="md"
                        />
                      </ScrollArea>
                    </Tabs.Panel>

                    <Tabs.Panel value="net">
                      <ScrollArea maw="100%">
                        <PlayerScorecard
                          day={TournamentDay.ALL}
                          scoreType={ScoreType.NET}
                          player={{ id: selectedPlayer.id, name: selectedPlayer.fullName }}
                          fz="md"
                        />
                      </ScrollArea>
                    </Tabs.Panel>
                  </Tabs>
                </Paper>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Stack>
    </>
  );
}
