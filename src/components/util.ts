export function getTournamentDay() {
  const currentDate = new Date();
  switch (currentDate.getDay()) {
    case 0:
      return 'sunday';
    case 6:
      return 'saturday';
    default:
      return 'friday';
  }
}

export function getTournamentYear(): number {
  const currentDate = new Date();
  return currentDate.getFullYear();
}

const getScore = (holes: Array<number>, start?: number, end?: number) => {
  return holes
    .slice(start, end)
    .reduce((accumulator, current) => accumulator + current, 0);
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
