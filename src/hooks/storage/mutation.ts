import { useMutation, useQueryClient } from 'react-query';

import { StorageFetch } from './fetch';

const storage = new StorageFetch();

export function useSaveLocal() {
  const client = useQueryClient();
  return useMutation(storage.save, {
    onSuccess: () => client.removeQueries('storage'),
  });
}

export function useDeleteItemStorage() {
  return useMutation(storage.deleteItem);
}

export function useDeleteAllStorage() {
  return useMutation(storage.deleteAll);
}
