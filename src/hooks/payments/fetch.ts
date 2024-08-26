import { api } from '@/services/api';

import { TCard, TCardToken } from './dtos/types';

export async function postCard(input: TCard) {
  const { data } = await api.post('/payment/card', input);

  return data;
}

export async function postCardToken(
  input: Omit<TCardToken, 'cardToken' | 'installmentCount' | 'expiry'>,
) {
  const { data } = await api.post('/payment/card-token', input);
  return data;
}
