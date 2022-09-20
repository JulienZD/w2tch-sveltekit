import { z } from 'zod';

export const zWatchListCreate = z.object({
  name: z.string().min(1),
});

export const zWatchListAddMovie = z.object({
  id: z.string().or(z.number()).transform(String),
  title: z.string().min(1),
  rating: z.number().min(0.1).max(10).nullish(),
});

export type WatchListAddMovie = z.infer<typeof zWatchListAddMovie>;
