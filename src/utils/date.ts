import { TournamentDay } from 'data/constants';

export const getTournamentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const getTournamentDay = () => {
  const currentDate = new Date();
  switch (currentDate.getDay()) {
    case 0:
      return TournamentDay.SUNDAY;
    case 6:
      return TournamentDay.SATURDAY;
    default:
      return TournamentDay.FRIDAY;
  }
};
