import { useMutation } from 'react-query';

import { UserFetch } from './fetchs';

const fetch = new UserFetch();

export function useLogin() {
  return useMutation(fetch.signIn);
}

export function useRegisterUer() {
  return useMutation(fetch.registerUser);
}
