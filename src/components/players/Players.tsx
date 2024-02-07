import { useState } from 'react';

import { ActionIcon, Button, Checkbox, Group, List, Modal, Stack, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as notifications from 'components/notifications';
import { SectionTitle } from 'components/common/typography';
import { DEFAULT_GRADIENT, DEFAULT_OVERLAY } from 'components/constants';
import { NewPlayerForm, NewPlayerTitle } from 'components/players/NewPlayer';
import { useDevice } from 'components/util';

import { deletePlayers, usePlayers } from 'hooks/players';

import './style.less';

export function Players() {
  const queryClient = useQueryClient();
  const [newPlayerFormOpened, { open: newPlayerFormOpen, close: newPlayerFormClose }] =
    useDisclosure(false);
  const [deleteConfirmOpened, { open: deleteConfirmOpen, close: deleteConfirmClose }] =
    useDisclosure(false);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const { isMobile } = useDevice();
  const { isSuccess, data } = usePlayers();
  const deletePlayersMutation = useMutation({
    mutationFn: (playerIds: number[]) => deletePlayers(playerIds),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
  const players = isSuccess ? data : [];

  const playersTableRows = players
    .sort((a, b) =>
      a.division > b.division ? 1 : a.division < b.division ? -1 : 0 || a.handicap - b.handicap,
    )
    .map((player) => {
      const isSelected = selectedPlayers.includes(player.id);
      return (
        <Table.Tr bg={isSelected ? 'var(--mantine-color-red-light)' : undefined} key={player.id}>
          <Table.Td>
            <Checkbox
              aria-label="Select player"
              color="red"
              checked={isSelected}
              onChange={(event) =>
                setSelectedPlayers(
                  event.currentTarget.checked
                    ? [...selectedPlayers, player.id]
                    : selectedPlayers.filter((selectedPlayer) => selectedPlayer !== player.id),
                )
              }
            />
          </Table.Td>
          <Table.Td>{player.fullName}</Table.Td>
          <Table.Td tt="capitalize">{player.division}</Table.Td>
          <Table.Td>{player.handicap}</Table.Td>
        </Table.Tr>
      );
    });

  const delPlayers = () => {
    const loadingNotification = notifications.loading('Deleting player(s)..');

    deletePlayersMutation.mutate(selectedPlayers, {
      onSettled: (response) => {
        if (response) {
          deleteConfirmClose();
          notifications.updateSuccess(loadingNotification, 'Deleted player(s)');
        } else {
          notifications.updateFailure(loadingNotification, 'Failed to delete player(s)');
        }
      },
    });
  };

  return (
    <>
      <Modal
        opened={newPlayerFormOpened}
        onClose={newPlayerFormClose}
        title={<NewPlayerTitle />}
        size="sm"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <NewPlayerForm closeModal={newPlayerFormClose} />
      </Modal>
      <Modal
        opened={deleteConfirmOpened}
        onClose={deleteConfirmClose}
        title="Confirm Deletion"
        size="sm"
        overlayProps={DEFAULT_OVERLAY}
      >
        <Stack>
          <List>
            {selectedPlayers.map((playerId) => {
              const player = players.find((player) => player.id === playerId);
              if (player) return <List.Item key={player.id}>{player.fullName}</List.Item>;
            })}
          </List>
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={deleteConfirmClose}>
              Cancel
            </Button>
            <Button bg="red" leftSection={<IconTrash size={14} />} onClick={delPlayers}>
              Delete Players
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Stack>
        <Group justify="space-between" align="flex-end">
          <SectionTitle>Players</SectionTitle>
          <Group>
            <ActionIcon
              variant="light"
              color="red"
              size="xl"
              aria-label="Delete selected players"
              onClick={deleteConfirmOpen}
              disabled={selectedPlayers.length === 0}
            >
              <IconTrash />
            </ActionIcon>
            <ActionIcon
              variant="gradient"
              size="xl"
              aria-label="Add new player"
              gradient={DEFAULT_GRADIENT}
              onClick={newPlayerFormOpen}
            >
              <IconPlus />
            </ActionIcon>
          </Group>
        </Group>
        <Table className="playersTable">
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>Player</Table.Th>
              <Table.Th>Division</Table.Th>
              <Table.Th>Handicap</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{playersTableRows}</Table.Tbody>
        </Table>
      </Stack>
    </>
  );
}
