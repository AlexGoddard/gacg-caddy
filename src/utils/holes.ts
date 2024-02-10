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
