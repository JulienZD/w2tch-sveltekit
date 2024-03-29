import { z } from 'zod';

export const zWatchListCreate = z.object({
  name: z.string().min(1),
});

export const zWatchListAddMovie = z.object({
  id: z.string().or(z.number()).transform(String),
  title: z.string().min(1),
  rating: z.number().min(0).max(10).nullable(),
});

export type WatchListAddMovie = z.infer<typeof zWatchListAddMovie>;

export const zWatchListPatchMovie = z.object({
  seenOn: z.boolean().transform((seen) => (seen ? new Date() : null)),
});

export type WatchListPatchMovie = {
  input: z.input<typeof zWatchListPatchMovie>;
  output: z.output<typeof zWatchListPatchMovie>;
};
