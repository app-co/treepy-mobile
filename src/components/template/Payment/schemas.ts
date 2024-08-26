import { z } from 'zod';

export const schemaCardToken = z.object({
  userId: z.string(),
  holderName: z.string(),
  card_number: z.string().transform(h => h.replace(' ', '').trim()),
  ccv: z.string().min(2),
  permission: z.boolean(),
  installmentCount: z.number(),
  expiry: z.string(),
});

export const schemaCard = z.object({
  amount: z.number(),
  installmentCount: z.number(),
  installmentValue: z.number(),
  userId: z.string(),
  cardToken: z.string(),
});

export type TCardToken = z.infer<typeof schemaCardToken>;
export type TCard = z.infer<typeof schemaCard>;
