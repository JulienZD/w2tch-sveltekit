import type { WatchListAddMovie } from '$lib/models/watchlist';
import { prisma } from '$lib/server/db';
import { Prisma } from '@prisma/client';
import { handlePrismaClientError } from '../errors';
import { enhanceWatchlistMovie } from './enhanceWatchlistMovie';

export const addMovieToWatchlist = async (watchlistId: string, movie: WatchListAddMovie) => {
  try {
    return await _addMovieToWatchList(watchlistId, movie);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }

    throw error;
  }
};

const _addMovieToWatchList = async (watchlistId: string, movie: WatchListAddMovie) => {
  const result = await prisma.watchGroup.update({
    where: {
      id: watchlistId,
    },
    include: {
      movies: {
        where: {
          movie: {
            externalId: movie.id,
          },
        },
        include: {
          movie: true,
        },
      },
    },
    data: {
      movies: {
        create: {
          movie: {
            connectOrCreate: {
              where: {
                source_externalId: {
                  externalId: movie.id,
                  source: 'TMDB',
                },
              },
              create: {
                name: movie.title,
                rating: movie.rating,
                externalId: movie.id,
                source: 'TMDB',
              },
            },
          },
        },
      },
    },
  });

  const [movieResult] = result.movies.map(enhanceWatchlistMovie);

  return movieResult;
};
