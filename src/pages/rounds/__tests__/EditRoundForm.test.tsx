import { TEST_HOLES, TEST_PLAYER, TEST_ROUND } from 'test-utils/constants';
import { fireEvent, render, screen } from 'test-utils/index';

import { EditRoundForm } from 'pages/rounds/EditRoundForm';

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

const validateInitialValues = async () => {
  expect(screen.getByRole('radio', { name: TEST_ROUND.day })).toBeChecked();
  expect(await screen.findByRole('textbox', { name: 'Player select' })).toHaveValue('Alex Goddard');

  let currentHole = 1;
  for (const score of TEST_ROUND.grossHoles) {
    expect(await screen.findByRole('textbox', { name: currentHole.toString() })).toHaveValue(
      score.toString(),
    );
    currentHole += 1;
  }
};

describe('edit round form', () => {
  it('renders with initial values set to match provided round', async () => {
    expect.assertions(20);
    render(<EditRoundForm round={TEST_ROUND} closeModal={() => undefined} />);

    await validateInitialValues();
  });

  it('resets to initial values when reset is clicked', async () => {
    expect.assertions(20);
    render(<EditRoundForm round={TEST_ROUND} closeModal={() => undefined} />);

    fireEvent.click(screen.getByRole('radio', { name: TournamentDay.SATURDAY }));

    let currentHole = 1;
    for (const score of TEST_ROUND.grossHoles) {
      const holeInput = await screen.findByRole('textbox', { name: currentHole.toString() });
      fireEvent.change(holeInput, { target: { value: (score + 1).toString() } });
      currentHole += 1;
    }

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await validateInitialValues();
  });
});
