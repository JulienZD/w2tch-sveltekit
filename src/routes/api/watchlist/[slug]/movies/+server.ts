import { zWatchListAddMovie } from '$lib/models/watchlist';
import { addMovieToWatchlist } from '$lib/server/db/watchlist';
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

  await addMovieToWatchlist(watchlistId, result.data);

  return json(undefined, { status: 201 });
};
