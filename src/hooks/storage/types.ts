import { z } from 'zod';

import { schemaSaveLocalStorage } from './schemas';

export type TSaveLocalStorage = z.infer<typeof schemaSaveLocalStorage>;
