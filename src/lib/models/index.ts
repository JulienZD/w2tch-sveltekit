import type { zMovieSearchResult } from '$lib/server/providers/moviedb/responses';
import type { Movie as PrismaMovie } from '@prisma/client';
import type { z } from 'zod';

export interface Movie extends Omit<PrismaMovie, 'rating' | 'source'> {
  rating?: number;
}

export interface WatchlistMovie extends Movie {
  seenOn: Date | null;
}

export type MovieSearchResult = z.infer<typeof zMovieSearchResult>;
