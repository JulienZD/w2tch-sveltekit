import { Movie as PrismaMovie } from '@prisma/client';

export interface Movie extends Omit<PrismaMovie, 'imdbRating'> {
  imdbRating: number;
}

export interface WatchlistMovie extends Movie {
  seenOn: Date | null;
}
