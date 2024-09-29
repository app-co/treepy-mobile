import { api } from '@/services/api';

import { IUserMetricas } from './dtos/interfaces';

export const fetchs = {
  getMetricas: async () => {
    const { data } = await api.get('/metrica-user');
    return data as IUserMetricas;
  },
};
