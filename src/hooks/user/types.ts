import { z } from 'zod';

import { schemaLogin, schemaRegisterUser } from './schemas';

export type TLogin = z.infer<typeof schemaLogin>;
export type TRegisteruser = z.infer<typeof schemaRegisterUser>;
