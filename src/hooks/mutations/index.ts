/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQueryClient } from 'react-query';

import { UseFatch } from '../fetchs';

const fetch = new UseFatch();

export function login() {
  const queryClient = useQueryClient();

  return useMutation(fetch.signIn, {
    onSuccess: () => {
      queryClient.invalidateQueries('signIn');
    },
  });
}

export function singUp() {
  const queryClient = useQueryClient();

  return useMutation(fetch.signUp, {
    onSuccess: () => {
      queryClient.invalidateQueries('signUp');
    },
  });
}
export function historicoAbastecimento() {
  const queryClient = useQueryClient();

  return useMutation(fetch.getHistoricoAbastecimento, {
    onSuccess: () => {
      queryClient.invalidateQueries('history-abastecimento');
    },
  });
}

export function gerarVirtualCard() {
  const queryClient = useQueryClient();

  return useMutation(fetch.gerarVirtualCard, {
    onSuccess: () => {
      queryClient.invalidateQueries('generat-virtual-card');
    },
  });
}
export function getPosts() {
  const queryClient = useQueryClient();

  return useMutation(fetch.getPostos, {
    onSuccess: () => {
      queryClient.invalidateQueries('get-postos');
    },
  });
}
export function updateUser() {
  const queryClient = useQueryClient();

  return useMutation(fetch.updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('update-user');
    },
  });
}
