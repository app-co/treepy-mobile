import { z } from 'zod';

import { schemaLogin } from './schemas';

export type TLogin = z.infer<typeof schemaLogin>;
