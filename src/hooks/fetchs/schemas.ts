import { z } from 'zod';

const pagination = z.object({
  pageSize: z.number().default(10).optional(),
  pageNumber: z.number().default(0).optional(),
});

export const schemaGerarCard = z.object({
  AssociadoId: z.string({ message: '* obrigatório' }).nullable(),
  Placa: z.string({ message: '* obrigatório' }),
  Cpf: z.string({ message: '* obrigatório' }),
});

export const schemaLogin = z.object({
  email: z.string({ message: '* obrigatório' }).email('email inválido'),
  senha: z
    .string({ message: '* obrigatório' })
    .min(6, 'mínimo de seis digitos'),
});

export const schemaSingUp = z.object({
  nomeCompleto: z.string({ message: '* obrigatório' }),
  email: z.string({ message: '* obrigatório' }).email('email inválido'),
  senha: z
    .string({ message: '* obrigatório' })
    .min(6, 'mínimo de seis digitos'),
  cpf: z.string({ message: '* obrigatório' }).min(11, 'documento inválido'),
  foto: z.string({ message: '* obrigatório' }).optional(),
  ddd: z.string({ message: '*' }),
  fone: z.string({ message: '* obrigatório' }),
  dataNacimento: z.string({ message: '* obrigatório' }),
});

export const schemaListPostos = z
  .object({
    Latitude: z.number(),
    Longitude: z.number(),
    Placa: z.string(),
    cpfCnpj: z.string(),
  })
  .merge(pagination);

export const schemaDetailsPostos = z.object({
  idPosto: z.string({ message: '* obrigatório' }),
  km: z.number().optional(),
});

export const schemaGetHistoricoAbastecimento = z.object({
  Todos: z.boolean().default(false),
  Ultimos7Dias: z.boolean().default(true),
  Ultimos15Dias: z.boolean().default(false),
  Ultimos30Dias: z.boolean().default(false),
  Ultimos90Dias: z.boolean().default(false),
  CpfCnpj: z.string({ message: '* obrigatório' }),
  Placa: z.string({ message: '* obrigatório' }).optional(),
});

export const schemaGetHistoricoPagemento = z.object({
  AssociadoId: z.string({ message: '* obrigatório' }),
});

export const schemaPlanoAssociado = z.object({
  CpfCnpj: z.string({ message: '* obrigatório' }),
});

export const schemaUpdateUser = z.object({
  nomeCompleto: z.string({ message: '* obrigatório' }),
  foto: z.string(),
  usuarioId: z.string({ message: '* obrigatório' }),
  email: z.string({ message: '* obrigatório' }),
  senha: z.string({ message: '* obrigatório' }).optional(),
});

export type TGerarCartao = z.infer<typeof schemaGerarCard>;
export type TListPostos = z.infer<typeof schemaListPostos>;
export type TDetailPostos = z.infer<typeof schemaDetailsPostos>;
export type TGetHistoricoAbastecimento = z.infer<
  typeof schemaGetHistoricoAbastecimento
>;
export type TLogin = z.infer<typeof schemaLogin>;
export type TRegisterUser = z.infer<typeof schemaSingUp>;
export type TGetHistoricoPagemento = z.infer<
  typeof schemaGetHistoricoPagemento
>;
export type TPlanoAssociado = z.infer<typeof schemaPlanoAssociado>;
export type TUpdateUser = z.infer<typeof schemaUpdateUser>;
