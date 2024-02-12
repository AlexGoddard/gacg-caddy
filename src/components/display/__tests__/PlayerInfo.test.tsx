import { render, screen } from 'test-utils';

import { PlayerInfo } from 'components/display/PlayerInfo';

import { Division } from 'data/constants';

import { Player } from 'hooks/players/model';

const TEST_PLAYER: Player = {
  id: 0,
  firstName: 'Alex',
  lastName: 'Goddard',
  fullName: 'Alex Goddard',
  division: Division.B,
  handicap: 28,
};

describe('player info', () => {
  it('renders', () => {
    render(<PlayerInfo size="xl" player={TEST_PLAYER} />);

    expect(screen.getByText('AG')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Alex Goddard');
    expect(screen.getByText(/Division/)).toHaveTextContent('b Division');
    expect(screen.getByText(/Handicap/)).toHaveTextContent('Handicap: 28');
  });
});
