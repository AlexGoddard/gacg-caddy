import { useQuery } from '@tanstack/react-query';

import { get } from 'util/network';

export interface Hole {
  holeNumber: number;
  par: number;
  handicap: number;
}

const fetchHoles = (): Promise<Hole[]> => get('/holes').then((holes) => holes);

export const useHolesQuery = { queryKey: ['holes'], queryFn: fetchHoles };

export const useHoles = () => useQuery(useHolesQuery);
