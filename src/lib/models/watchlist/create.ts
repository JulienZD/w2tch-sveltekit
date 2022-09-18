import { z } from 'zod';

export const zWatchListCreate = z.object({
  name: z.string().min(1),
});
