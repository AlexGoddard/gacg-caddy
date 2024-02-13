import { TEST_HOLES, TEST_PLAYER } from 'test-utils/constants';
import { fireEvent, render, screen } from 'test-utils/index';

import { NewRoundForm } from 'pages/rounds/NewRoundForm';

import { TournamentDay } from 'data/constants';

vi.mock('hooks/holes/useHoles', () => ({
  useHolesQuery: { queryKey: ['holes'], queryFn: () => TEST_HOLES },
}));

vi.mock('hooks/players/usePlayers', () => ({
  usePlayersQuery: {
    queryKey: ['players'],
    queryFn: () => [TEST_PLAYER],
  },
  usePlayers: vi.fn().mockReturnValue({
    isSuccess: true,
    data: [TEST_PLAYER],
    status: 'success',
  }),
}));

vi.mock('utils/date', () => ({
  getTournamentDay: vi.fn().mockReturnValue('friday'),
}));

const validateInitialValues = async () => {
  expect(screen.getByRole('radio', { name: TournamentDay.FRIDAY })).toBeChecked();
  expect(await screen.findByRole('textbox', { name: 'Player select' })).not.toHaveValue();

  for (const hole of TEST_HOLES) {
    expect(
      await screen.findByRole('textbox', { name: hole.holeNumber.toString() }),
    ).not.toHaveValue();
  }
};

describe('new round form', () => {
  it('renders with initial values set to defaults', async () => {
    expect.assertions(20);
    render(<NewRoundForm closeModal={() => undefined} />);

    await validateInitialValues();
  });

  it('resets to initial values when clear is clicked', async () => {
    expect.assertions(20);
    render(<NewRoundForm closeModal={() => undefined} />);

    fireEvent.click(screen.getByRole('radio', { name: TournamentDay.SATURDAY }));

    for (const hole of TEST_HOLES) {
      const holeInput = await screen.findByRole('textbox', { name: hole.holeNumber.toString() });
      fireEvent.change(holeInput, { target: { value: '1' } });
    }

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await validateInitialValues();
  });
});
