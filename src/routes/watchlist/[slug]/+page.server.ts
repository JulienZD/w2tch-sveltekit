import { prisma } from '$lib/db/client';
import type { WatchlistMovie } from '$lib/models';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
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
              imageUrl: true,
              imdbUrl: true,
              imdbRating: true,
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
      id: params.slug,
      OR: [
        {
          watchers: {
            some: {
              watcherId: locals.user?.id,
            },
          },
        },
        {
          ownerId: locals.user?.id,
        },
      ],
    },
  });

  if (!watchlist) {
    throw error(404, 'Not Found');
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
        imdbRating: movie.imdbRating.toNumber(),
        seenOn,
      })
    ),
  };

  return { watchlist: mappedWatchList };
};
