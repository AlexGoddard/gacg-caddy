import { TEST_PLAYER } from 'test-utils/constants';
import { renderWithWrapper, screen } from 'test-utils/index';

import { PlayerInfo } from './PlayerInfo';

describe('player info', () => {
  it('renders', () => {
    renderWithWrapper(<PlayerInfo size="xl" player={TEST_PLAYER} />);

    expect(screen.getByText('AG')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Alex Goddard');
    expect(screen.getByText(/Division/)).toHaveTextContent('b Division');
    expect(screen.getByText(/Handicap/)).toHaveTextContent('Handicap: 28');
  });
});
