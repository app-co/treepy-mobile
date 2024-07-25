import { z } from 'zod';

export const schemaSaveLocalStorage = z.object({
  key: z.string(),
  value: z.any(),
});
