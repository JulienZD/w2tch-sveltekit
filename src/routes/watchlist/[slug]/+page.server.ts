import { prisma } from '$lib/db/client';
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

  // @ts-expect-error Prisma uses Decimal.js under the hood, which can't automatically be converted
  watchlist.movies.forEach(({ movie }) => (movie.imdbRating = movie.imdbRating.toNumber()));
  return { watchlist };
};
