import { useQuery } from '@tanstack/react-query';

import { get } from 'utils/network';

import { Hole } from 'hooks/holes/model';

export const HOLES_PATH = 'holes';

export const useHolesQuery = { queryKey: [HOLES_PATH], queryFn: fetchHoles };

export const useHoles = () => useQuery(useHolesQuery);

function fetchHoles(): Promise<Hole[]> {
  return get(`/${HOLES_PATH}`).then((holes) => holes);
}
