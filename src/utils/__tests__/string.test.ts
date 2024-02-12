import { formatName } from 'utils/string';

describe('name formatter', () => {
  it('capitalizes the first letter of each word', () => {
    expect(formatName('jean pierre')).toBe('Jean Pierre');
  });

  it('capitalizes the first letter after an apostrophe', () => {
    expect(formatName("o'brien")).toBe("O'Brien");
  });

  it('preserves capitalization otherwise', () => {
    expect(formatName('gREGoRY')).toBe('GREGoRY');
  });
});
