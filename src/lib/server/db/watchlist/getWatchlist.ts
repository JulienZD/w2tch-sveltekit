import { prisma } from '$lib/server/db';
import type { WatchlistMovie } from '$lib/models';

export const getWatchlist = async (id: string, userId: string) => {
  const watchlist = await prisma.watchGroup.findFirst({
    include: {
      owner: {
        select: {
          name: true,
        },
      },
      movies: {
        include: {
          movie: {
            select: {
              name: true,
              id: true,
              externalId: true,
              rating: true,
            },
          },
        },
      },
      _count: {
        select: {
          watchers: true,
          movies: true,
        },
      },
    },
    where: {
      id,
      OR: [
        {
          watchers: {
            some: {
              watcherId: userId,
            },
          },
        },
        {
          ownerId: userId,
        },
      ],
    },
  });

  if (!watchlist) {
    return null;
  }

  // Prisma's returned data structure isn't very easy to work with to display data,
  // so we map it into a better structure
  const { _count, ...watchlistData } = watchlist;
  const mappedWatchList = {
    ...watchlistData,
    memberCount: _count.watchers,
    movieCount: _count.movies,
    movies: watchlistData.movies.map(
      ({ seenOn, movie }): WatchlistMovie => ({
        ...movie,
        rating: movie.rating?.toNumber(),
        seenOn,
      })
    ),
  };

  return mappedWatchList;
};
