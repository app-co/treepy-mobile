/* eslint-disable class-methods-use-this */

import { api } from '@/services/api';

import { TLogin, TRegisterUser } from './schemas';
import { ILoginUser, IUser } from './types';

type Params = {
  DeviceId: string;
};

export class UseFatch {
  async signIn(params: TLogin) {
    const { data } = await api.post('/Usuario/login', params);

    return data as IUser;
  }

  async signUp(params: TRegisterUser) {
    const { data } = await api.post('/Usuario/App', params);

    return data as ILoginUser;
  }
}
