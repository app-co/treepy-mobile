import { useMutation } from 'react-query';

import { postCard, postCardToken } from './fetch';

export function useCard() {
  const payCard = useMutation(postCard);
  const cardToken = useMutation(postCardToken);

  return {
    payCard,
    cardToken,
  };
}
