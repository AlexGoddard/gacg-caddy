export enum ScoreType {
  GROSS = 'gross',
  NET = 'net',
}
export enum TournamentDay {
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
  ALL = 'all',
}
export enum Division {
  A = 'a',
  B = 'b',
}

export const DEFAULT_OVERLAY = { backgroundOpacity: 0.55, blur: 3 };
export const PLACEHOLDER_SCORES = new Array(18).fill('');
