import { useMediaQuery } from '@mantine/hooks';

export const useDevice = () => {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return { isMobile };
};
