import { Division } from 'data/constants';

import { Player } from 'hooks/players/model';

import { del, get, post, put } from './network';

const TEST_PLAYER: Player = {
  id: 0,
  firstName: 'Alex',
  lastName: 'Goddard',
  fullName: 'Alex Goddard',
  division: Division.B,
  handicap: 28,
};

describe('request handler', () => {
  beforeAll(() => {
    vi.stubGlobal('api', { invoke: vi.fn() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('all methods should call api.invoke on correct channel with arguments', async () => {
    expect.assertions(8);
    const invokeSpy = vi.spyOn(window.api, 'invoke');

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
