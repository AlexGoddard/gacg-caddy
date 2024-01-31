import { ReactNode } from 'react';
import { Paper, Stack, StackProps, Table, TableProps, Title } from '@mantine/core';
import { DataTable, DataTableProps } from 'mantine-datatable';

import './style.css';

interface SplitDataProps extends StackProps {
  topSection: ReactNode;
  bottomSection: ReactNode;
}

interface TitledTableProps extends TableProps {
  title: string;
}

export const SplitData = (props: SplitDataProps) => {
  const { topSection, bottomSection, ...otherProps } = props;

  return (
    <Stack gap={0} className="splitData" {...otherProps}>
      <Paper>{topSection}</Paper>
      <Paper className="splitDataBottom">{bottomSection}</Paper>
    </Stack>
  );
};

export const TitledTable = (props: TitledTableProps) => {
  const { title, data, ...otherProps } = props;
  return (
    <Stack>
      <Title order={3}>{title}</Title>
      <Table className="titledTable" data={data} {...otherProps} />
    </Stack>
  );
};
