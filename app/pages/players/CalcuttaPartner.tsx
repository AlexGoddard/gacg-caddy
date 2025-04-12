import { useState } from 'react';

import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Paper,
  Popover,
  SelectProps,
  Stack,
  StackProps,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useFocusTrap } from '@mantine/hooks';
import { IconUnlink, IconX } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';
import { PlayerInfo } from 'components/display/PlayerInfo';
import { PlayerSelect } from 'components/inputs/PlayerSelect';

import { DEFAULT_OVERLAY, Division } from 'data/constants';

import { useCreateTeam } from 'hooks/calcutta/useCreateTeam';
import { useDeleteTeam } from 'hooks/calcutta/useDeleteTeam';
import { Player } from 'hooks/players/model';
import { useAvailablePlayers } from 'hooks/players/useAvailablePlayers';
import { usePartner } from 'hooks/players/usePartner';

interface CalcuttaPartnerProps extends StackProps {
  player: Player;
}

interface CalcuttaPartnerSelectProps extends SelectProps {
  division: Division;
}

export const CalcuttaPartner = (props: CalcuttaPartnerProps) => {
  const { player, ...otherProps } = props;

  const focusTrapRef = useFocusTrap();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>('');
  const [selectPartnerOpened, setSelectPartnerOpened] = useState(false);
  const [removeConfirmOpened, { open: removeConfirmOpen, close: removeConfirmClose }] =
    useDisclosure(false);

  const { isPending, isSuccess, isError, error, data } = usePartner(player.id);

  const createTeamMutation = useCreateTeam(player.id);
  const deleteTeamMutation = useDeleteTeam(player.id);

  const addPartner = () => {
    const loadingNotification = notifications.loading('Adding partner..');

    const aPlayerId = player.division === Division.A ? player.id : Number(selectedPartnerId);
    const bPlayerId = aPlayerId === player.id ? Number(selectedPartnerId) : player.id;

    createTeamMutation.mutate(
      { aPlayerId: aPlayerId, bPlayerId: bPlayerId },
      {
        onSettled: (response) => {
          if (response) {
            notifications.updateSuccess(loadingNotification, 'Added partner');
          } else {
            notifications.updateFailure(loadingNotification, 'Failed to add partner');
          }
        },
      },
    );
  };

  const removePartner = () => {
    const loadingNotification = notifications.loading('Removing Calcutta partner..');

    deleteTeamMutation.mutate(data!.id, {
      onSettled: (response) => {
        if (response) {
          notifications.updateSuccess(loadingNotification, 'Removed partner');
        } else {
          notifications.updateFailure(loadingNotification, 'Failed to remove partner');
        }
      },
    });
    removeConfirmClose();
  };

  return (
    <Stack {...otherProps} gap="xxs">
      {isPending && <Text>Loading..</Text>}
      {isError && <Text c="blush">{error.message}</Text>}
      {isSuccess && (
        <>
          {data ? (
            <>
              <Modal
                opened={removeConfirmOpened}
                onClose={removeConfirmClose}
                title="Confirm Removal"
                size="md"
                overlayProps={DEFAULT_OVERLAY}
              >
                <Stack>
                  <Text>Are you sure you want to remove Calcutta partner {data.fullName}?</Text>
                  <Group justify="flex-end">
                    <Button variant="subtle" onClick={removeConfirmClose}>
                      Cancel
                    </Button>
                    <Button
                      color="blush.6"
                      leftSection={<IconUnlink size={14} />}
                      onClick={removePartner}
                    >
                      Remove Partner
                    </Button>
                  </Group>
                </Stack>
              </Modal>
              <Paper p="xs" shadow="sm" pos="relative">
                <ActionIcon
                  c="dimmed"
                  variant="transparent"
                  onClick={removeConfirmOpen}
                  classNames={{ root: 'removePartner', icon: 'removePartnerIcon' }}
                >
                  <IconX />
                </ActionIcon>
                <PlayerInfo player={data} size="md" />
              </Paper>
            </>
          ) : (
            <Popover
              position="bottom"
              withArrow
              shadow="md"
              opened={selectPartnerOpened}
              onChange={setSelectPartnerOpened}
            >
              <Popover.Target>
                <Button onClick={() => setSelectPartnerOpened((opened) => !opened)}>
                  Select Partner
                </Button>
              </Popover.Target>
              <Popover.Dropdown ref={focusTrapRef}>
                <Stack>
                  <Title order={3}>Available Partners</Title>
                  <CalcuttaPartnerSelect
                    division={player.division === Division.A ? Division.B : Division.A}
                    value={selectedPartnerId}
                    onChange={setSelectedPartnerId}
                    comboboxProps={{ withinPortal: false }}
                  />
                  <Button
                    onClick={() => {
                      setSelectPartnerOpened(false);
                      addPartner();
                    }}
                  >
                    Confirm
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          )}
        </>
      )}
    </Stack>
  );
};

export const CalcuttaPartnerSelect = (props: CalcuttaPartnerSelectProps) => {
  const { division, ...otherProps } = props;
  const { status, error, data } = useAvailablePlayers(division);
  const players = status === 'success' ? data : [];

  return (
    <PlayerSelect
      data={players.map((player) => ({ value: player.id.toString(), label: player.fullName }))}
      playersQueryStatus={status}
      playersQueryError={error}
      {...otherProps}
    />
  );
};
