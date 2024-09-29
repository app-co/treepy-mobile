import { useQuery } from 'react-query';

import { fetchs } from './fetchs';

export function useUserMetricas() {
  return useQuery({
    queryKey: 'user-metricas',
    queryFn: fetchs.getMetricas,
  });
}
