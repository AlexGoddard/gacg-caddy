import { TEST_PLAYER, TEST_SCORES } from 'test-utils/constants';

import { getGross, getIn, getNet, getOut, sum } from 'utils/holes';

const TEST_NUMBERS = [1, 2, 3];

describe('hole utils', () => {
  it('getOut should sum front 9', () => {
    expect(getOut(TEST_SCORES)).toBe(39);
  });

  it('getIn should sum back 9', () => {
    expect(getIn(TEST_SCORES)).toBe(34);
  });

  it('getGross should sum all 18', () => {
    expect(getGross(TEST_SCORES)).toBe(73);
  });

  it('getNet should sum all 18 and subtract handicap', () => {
    expect(getNet(TEST_SCORES, TEST_PLAYER.handicap)).toBe(45);
  });

  describe('sum', () => {
    it('should sum all values regardless of length', () => {
      expect(sum(TEST_NUMBERS)).toBe(6);
    });

    it('should respect start and end values', () => {
      expect(sum(TEST_NUMBERS, 0, 2)).toBe(3);
    });

    it('should respect negative start values', () => {
      expect(sum(TEST_NUMBERS, -2)).toBe(5);
    });
  });
});
