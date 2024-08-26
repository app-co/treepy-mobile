import { z } from 'zod';

import { schemaCard, schemaCardToken } from '../schema';

export type TCardToken = z.infer<typeof schemaCardToken>;
export type TCard = z.infer<typeof schemaCard>;
