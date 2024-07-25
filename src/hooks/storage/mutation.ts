import { useMutation } from 'react-query';

import { StorageFetch } from './fetch';

const storage = new StorageFetch();

export function useSaveLocal() {
  return useMutation(storage.save);
}

export function useGetStorage() {
  return useMutation(storage.get);
}

export function useDeleteItemStorage() {
  return useMutation(storage.deleteItem);
}

export function useDeleteAllStorage() {
  return useMutation(storage.deleteAll);
}
