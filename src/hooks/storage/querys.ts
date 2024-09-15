import { useQuery } from 'react-query';

import { StorageFetch } from './fetch';

const fetch = new StorageFetch();
export function useGetStorage(key: string) {
  return useQuery({
    queryKey: ['storage', key],
    queryFn: () => fetch.get(key),
  });
}
