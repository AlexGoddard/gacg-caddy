import { TournamentDay } from './constants';

export const getWhereClause = (day: TournamentDay, playerId?: number) => {
  const conditions: string[] = [];
  if (day !== TournamentDay.ALL) conditions.push('day=@day');
  if (playerId) conditions.push('playerId=@playerId');
  if (conditions.length > 0) return `WHERE ${conditions.join(' AND ')}`;
  return '';
};
