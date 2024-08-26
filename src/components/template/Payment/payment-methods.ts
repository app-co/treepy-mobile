/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { ZodError } from 'zod';

import { api } from '@/services/api';
import { AppError } from '@/services/AppError';

import { TCard, TCardToken, schemaCard, schemaCardToken } from './schemas';

interface IPix {
  value: number;
}
export class PaymentMethodAsaas {
  async cardToken(
    input: Omit<TCardToken, 'cardToken' | 'installmentCount' | 'expiry'>,
  ) {
    try {
      const data = schemaCardToken.parse(input);
      const token = await api.post('/payment/card-token', data);
      return token.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.message);
      }
      if (error instanceof ZodError) {
        throw new AppError(
          `${error.issues[0].path} - ${error.issues[0].message}`,
        );
      }
    }
  }

  async card(input: TCard) {
    const data = schemaCard.parse(input);

    await api.post('/payment/card', input);
  }

  async boleto(input: IPix) {
    const { data } = await api.post('/payment/boleto', input);

    return data as { invoiceUrl: string; barCode: string; id: string };
  }

  async pix(input: IPix) {
    const { data } = await api.post('/payment/pix', input);

    return data as { payload: string; image: string };
  }
}
