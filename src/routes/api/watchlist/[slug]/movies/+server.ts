import { prisma } from '$lib/db/client';
import { zWatchListAddMovie, type WatchListAddMovie } from '$lib/models/watchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// Adds a movie to a Watchlist. Stores the movie in the database if it isn't yet known
export const POST: RequestHandler = async ({ request, locals, params }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorized');

  const watchlistId = params.slug;
  if (!watchlistId) throw error(404, 'Not Found');

  const body = await request.json();

  const result = zWatchListAddMovie.safeParse(body);

  if (!result.success) {
    return json(
      {
        error: result.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  await addMovieToWatchList(watchlistId, result.data);

  return json(null, { status: 201 });
};

const addMovieToWatchList = async (watchlistId: string, movie: WatchListAddMovie) => {
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
