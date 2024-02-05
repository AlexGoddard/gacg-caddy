import { useMediaQuery } from '@mantine/hooks';

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

export const getOut = (holes: Array<number>) => {
  return sum(holes, 0, 9);
};

export const getIn = (holes: Array<number>) => {
  return sum(holes, -9);
};

export const getGross = (holes: Array<number>) => {
  return sum(holes);
};

export const getNet = (holes: Array<number>, handicap: number) => {
  return getGross(holes) - handicap;
};

export const sum = (arrToSum: number[], start?: number, end?: number) => {
  return arrToSum.slice(start, end).reduce((sum, current) => sum + current, 0);
};

export const useDevice = () => {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return { isMobile };
};
