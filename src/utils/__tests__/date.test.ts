import { TournamentDay } from 'data/constants';
import { getTournamentDay, getTournamentYear } from 'utils/date';

describe('tournament day', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is TournamentDay.SATURDAY on saturday', () => {
    const date = new Date(2024, 0, 6);
    vi.setSystemTime(date);

    expect(getTournamentDay()).toBe(TournamentDay.SATURDAY);
  });

  it('is TournamentDay.SUNDAY on sunday', () => {
    const date = new Date(2024, 0, 7);
    vi.setSystemTime(date);

    expect(getTournamentDay()).toBe(TournamentDay.SUNDAY);
  });

  it('is TournamentDay.FRIDAY every of day of the week', () => {
    [1, 2, 3, 4, 5].map((day) => {
      const date = new Date(2024, 0, day);
      vi.setSystemTime(date);

      expect(getTournamentDay()).toBe(TournamentDay.FRIDAY);
    });
  });
});

describe('tournament year', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns current year', () => {
    const date = new Date(2021, 0, 1);
    vi.setSystemTime(date);

    expect(getTournamentYear()).toBe(2021);
  });
});
