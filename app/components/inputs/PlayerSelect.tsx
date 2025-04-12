import { Group, Loader, Select, SelectProps } from '@mantine/core';

import { ErrorFeedback } from 'components/feedback/ErrorFeedback';

export interface PlayerSelectProps extends SelectProps {
  playersQueryStatus: 'error' | 'success' | 'pending';
  playersQueryError: Error | null;
}

export const PlayerSelect = (props: PlayerSelectProps) => {
  const { playersQueryStatus, playersQueryError, ...otherProps } = props;
  return (
    <Group gap="xs">
      <Select
        aria-label="Player select"
        placeholder={playersQueryStatus === 'pending' ? 'Loading players..' : 'Search players..'}
        disabled={playersQueryStatus !== 'success'}
        comboboxProps={{
          transitionProps: { transition: 'pop', duration: 300 },
        }}
        searchable
        clearable
        selectFirstOptionOnChange
        {...otherProps}
      />
      {playersQueryStatus === 'pending' && <Loader size="xs" />}
      {playersQueryStatus === 'error' && <ErrorFeedback label={playersQueryError!.message} />}
    </Group>
  );
};
