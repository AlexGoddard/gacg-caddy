import { Division, TournamentDay } from '../app/data/constants';
import { Hole } from '../app/hooks/holes/model';
import { Player } from '../app/hooks/players/model';
import { Round } from '../app/hooks/rounds/model';

export const TEST_HOLES: Hole[] = new Array(18)
  .fill(0)
  .map((_, index) => ({ holeNumber: index + 1, par: 4, handicap: 4 }));

export const TEST_PLAYER: Player = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Goddard',
  fullName: 'Alex Goddard',
  division: Division.B,
  handicap: 28,
};

export const TEST_SCORES = [4, 5, 7, 3, 4, 5, 4, 3, 4, 4, 3, 5, 3, 4, 3, 5, 3, 4];

export const TEST_ROUND: Round = {
  playerId: 1,
  day: TournamentDay.FRIDAY,
  grossHoles: TEST_SCORES,
};
