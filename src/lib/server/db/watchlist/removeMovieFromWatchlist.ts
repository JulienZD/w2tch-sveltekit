import { Prisma } from '@prisma/client';
import { prisma } from '..';
import { handlePrismaClientError } from '../errors';
import { enhanceWatchlistMovie } from './enhanceWatchlistMovie';

export const removeMovieFromWatchlist = async (watchlistId: string, watchlistMovieId: string) => {
  try {
    return await _removeMovieFromWatchlist(watchlistId, watchlistMovieId);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }

    throw error;
  }
};

const _removeMovieFromWatchlist = async (watchlistId: string, watchlistMovieId: string) => {
  const result = await prisma.moviesOnWatchGroups.delete({
    where: {
      movieId_watchGroupId: {
        movieId: watchlistMovieId,
        watchGroupId: watchlistId,
      },
    },
    include: {
      movie: true,
    },
  });

  return enhanceWatchlistMovie(result);
};
