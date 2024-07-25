import { useQuery } from 'react-query';

import { UserFetch } from './fetchs';

const fetch = new UserFetch();

export function useUserById() {
  return useQuery({
    queryKey: ['user@byId'],
    queryFn: async () => fetch.userByID(),
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });
}

export function useMetricas() {
  return useQuery({
    queryKey: ['user@metricas'],
    queryFn: async () => fetch.getResumo(),
    refetchInterval: 60 * 60 * 1000, // 1 hour
  });
}
