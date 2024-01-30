import { TournamentDay } from './constants';

export function getTournamentDay() {
  const currentDate = new Date();
  switch (currentDate.getDay()) {
    case 0:
      return TournamentDay.SUNDAY;
    case 6:
      return TournamentDay.SATURDAY;
    default:
      return TournamentDay.FRIDAY;
  }
}

export const getTournamentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export const getFullName = (firstName: string, lastName: string) => {
  return `${firstName} ${lastName}`;
};

export const getOut = (holes: Array<number>) => {
  return getScore(holes, 0, 9);
};

export const getIn = (holes: Array<number>) => {
  return getScore(holes, -9);
};

export const getGross = (holes: Array<number>) => {
  return getScore(holes);
};

export const getNet = (holes: Array<number>, handicap: number) => {
  return getGross(holes) - handicap;
};

const getScore = (holes: Array<number>, start?: number, end?: number) => {
  return holes.slice(start, end).reduce((sum, current) => sum + current, 0);
};
