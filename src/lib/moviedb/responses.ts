import { z } from 'zod';

export type PaginatedResult<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

const zMovieDBSearchResult = z.object({
  id: z.number(),
  title: z.string(),
  genre_ids: z.number().array(),
  release_date: z.string().nullish(),
  overview: z.string(),
  original_title: z.string(),
  original_language: z.string(),
  popularity: z.number(),
  vote_count: z.number(),
  video: z.boolean(),
  vote_average: z.number(),
  adult: z.boolean(),
  poster_path: z.string().startsWith('/').nullable(),
  backdrop_path: z.string().nullable(),
});
export type MovieDBSearchResult = z.infer<typeof zMovieDBSearchResult>;

export const zMovieSearchResult = zMovieDBSearchResult.transform((result) => ({
  id: result.id,
  title: result.title,
  imagePath: result.poster_path,
}));
