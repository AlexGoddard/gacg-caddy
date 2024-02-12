import isElectron from 'is-electron';

import { Division } from 'data/constants';
import { del, get, post, put } from 'utils/network';

import { Player } from 'hooks/players/model';

const TEST_PLAYER: Player = {
  id: 0,
  firstName: 'Alex',
  lastName: 'Goddard',
  fullName: 'Alex Goddard',
  division: Division.B,
  handicap: 28,
};

vi.mock('is-electron', () => ({
  default: vi.fn().mockReturnValue(true),
}));

describe('request handler', () => {
  beforeAll(() => {
    vi.stubGlobal('ipcRenderer', { invoke: vi.fn() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('electron', async () => {
    it('all methods should call ipcRenderer.invoke on correct channel with arguments', async () => {
      expect.assertions(8);
      const invokeSpy = vi.spyOn(window.ipcRenderer, 'invoke');

      await post('/players', TEST_PLAYER);
      expect(invokeSpy).toBeCalledTimes(1);
      expect(invokeSpy).toBeCalledWith('/players/post', TEST_PLAYER);

      await get('/players', TEST_PLAYER);
      expect(invokeSpy).toBeCalledTimes(2);
      expect(invokeSpy).toBeCalledWith('/players/get', TEST_PLAYER);

      await put('/players', TEST_PLAYER);
      expect(invokeSpy).toBeCalledTimes(3);
      expect(invokeSpy).toBeCalledWith('/players/put', TEST_PLAYER);

      await del('/players', TEST_PLAYER);
      expect(invokeSpy).toBeCalledTimes(4);
      expect(invokeSpy).toBeCalledWith('/players/delete', TEST_PLAYER);
    });
  });

  describe('web', () => {
    it('all methods should throw error', () => {
      const NOT_YET_IMPLEMENTED = 'not yet implemented';
      vi.mocked(isElectron).mockReturnValue(false);
      expect(() => post('/players', {})).rejects.toThrowError(NOT_YET_IMPLEMENTED);
      expect(() => get('/players', {})).rejects.toThrowError(NOT_YET_IMPLEMENTED);
      expect(() => put('/players', {})).rejects.toThrowError(NOT_YET_IMPLEMENTED);
      expect(() => del('/players', {})).rejects.toThrowError(NOT_YET_IMPLEMENTED);
    });
  });
});
