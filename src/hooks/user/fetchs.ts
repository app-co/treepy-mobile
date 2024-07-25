/* eslint-disable class-methods-use-this */
import { api } from '@/services/api';

import { IMetricas } from './interface';
import { TLogin } from './types';

export class UserFetch {
  async signIn(params: TLogin) {
    const { data } = await api.post('/user/session', params);

    return data;
  }

  // async signUp(params: TRegisterUser) {
  //   const { data } = await api.post('/user', params);

  //   return data as ILoginUser;
  // }

  async userByID() {
    const { data } = await api.get('/me');

    return data;
  }

  async getResumo() {
    const status: { [key: string]: string } = {
      PAID: 'PAID',
      AUTHORIZED: 'AUTHORIZED',
    };

    const data = await api.get('/user-resumo');
    const response = data.data as IMetricas;
    const paid = response.extrato.filter(h => h.status === status[h.status]);

    const rs = {
      ...response,
      extrato: response.extrato || [],
      extratoPaid: paid || [],
    };

    return rs as IMetricas;
  }
}
