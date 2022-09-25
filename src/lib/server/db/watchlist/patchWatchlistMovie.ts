import type { WatchListPatchMovie } from '$lib/models/watchlist';
import { Prisma } from '@prisma/client';
import { prisma } from '..';
import { handlePrismaClientError } from '../errors';
import { enhanceWatchlistMovie } from './enhanceWatchlistMovie';

export const patchWatchlistMovie = async (
  watchlistId: string,
  movieId: string,
  data: Partial<WatchListPatchMovie['output']>
) => {
  try {
    return await _patchWatchlistMovie(watchlistId, movieId, data);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }
    throw error;
  }
};

const _patchWatchlistMovie = async (
  watchlistId: string,
  movieId: string,
  data: Partial<WatchListPatchMovie['output']>
) => {
  const result = await prisma.moviesOnWatchGroups.update({
    where: {
      movieId_watchGroupId: {
        movieId,
        watchGroupId: watchlistId,
      },
    },
    data: {
      seenOn: data.seenOn,
    },
    include: {
      movie: true,
    },
  });

  return enhanceWatchlistMovie(result);
};
