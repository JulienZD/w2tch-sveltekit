import type { WatchlistMovie } from '$lib/models';
import type { Movie, MoviesOnWatchGroups } from '@prisma/client';

export const enhanceWatchlistMovie = ({
  seenOn,
  movie,
}: MoviesOnWatchGroups & {
  movie: Movie;
}): WatchlistMovie => ({
  ...movie,
  rating: movie.rating?.toNumber(),
  seenOn,
});
