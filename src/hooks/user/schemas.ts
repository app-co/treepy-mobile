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

export const schemaRegisterUser = z
  .object({
    full_name: z.string({ message: '* obrigatório' }),
    email: z.string({ message: '* obrigatório' }),
    password: z
      .string({ message: '* obrigatório' })
      .min(6, 'mínimo de seis digitos'),
    replace_password: z
      .string({ message: '* obrigatório' })
      .min(6, 'mínimo de seis digitos'),
  })
  .refine(h => h.password === h.replace_password, {
    message: 'Senhas não conferem',
    path: ['replace_password'],
  });
