import type { WatchListAddMovie } from '$lib/models/watchlist';
import { prisma } from '$lib/server/db';

export const addMovieToWatchlist = async (watchlistId: string, movie: WatchListAddMovie) => {
  await prisma.watchGroup.update({
    where: {
      id: watchlistId,
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
};
