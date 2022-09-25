import { DatabaseError, PrismaError } from '$lib/server/db/errors';
import { getWatchlist } from '$lib/server/db/watchlist';
import { removeMovieFromWatchlist } from '$lib/server/db/watchlist/removeMovieFromWatchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorized');

  const notFound = error(404, 'Not Found');

  const watchlistMovieId = params.movie;
  if (!watchlistMovieId) throw notFound;

  const watchlistId = params.slug;
  if (!watchlistId) throw notFound;

  // Ensure this user has access to the watchlist
  const watchlist = await getWatchlist(watchlistId, userId);
  if (!watchlist) throw notFound;

  try {
    const deletedMovie = await removeMovieFromWatchlist(watchlist.id, watchlistMovieId);
    return json(deletedMovie, { status: 200 });
  } catch (error) {
    if (error instanceof DatabaseError && error.message === PrismaError.REQUIRED_RECORD_NOT_FOUND) {
      return json({ error }, { status: 404 });
    }

    // TODO: Log error
    console.error(error);
  }

  return json({ error: 'An unknown error occurred' }, { status: 500 });
};
