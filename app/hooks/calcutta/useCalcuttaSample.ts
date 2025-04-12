import { useQuery } from '@tanstack/react-query';

import { get } from 'utils/network';

export const CALCUTTA_SAMPLE_PATH = 'calcutta/sample';

export const useCalcuttaSampleQuery = (isEnabled: boolean) => ({
  queryKey: [CALCUTTA_SAMPLE_PATH],
  queryFn: fetchCalcuttaSample,
  enabled: isEnabled,
});

export const useCalcuttaSample = (isEnabled: boolean) =>
  useQuery(useCalcuttaSampleQuery(isEnabled));

function fetchCalcuttaSample(): Promise<string[][]> {
  return get(`/${CALCUTTA_SAMPLE_PATH}`).then(
    (calcuttaSample) => calcuttaSample,
  );
}
