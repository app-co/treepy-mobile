import { z } from 'zod';

const pagination = z.object({
  pageSize: z.number().default(10).optional(),
  pageNumber: z.number().default(0).optional(),
});

export const schemaLogin = z.object({
  email: z.string({ message: '* obrigatório' }).email('email inválido'),
  password: z
    .string({ message: '* obrigatório' })
    .min(6, 'mínimo de seis digitos'),
});
