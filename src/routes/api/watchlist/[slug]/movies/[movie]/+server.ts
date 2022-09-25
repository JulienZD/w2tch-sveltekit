import { zWatchListPatchMovie } from '$lib/models/watchlist';
import { DatabaseError, PrismaError } from '$lib/server/db/errors';
import { getWatchlist } from '$lib/server/db/watchlist';
import { patchWatchlistMovie } from '$lib/server/db/watchlist/patchWatchlistMovie';
import { removeMovieFromWatchlist } from '$lib/server/db/watchlist/removeMovieFromWatchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { watchlistId, watchlistMovieId } = await validateAndExtractRequestData({ locals, params });

  try {
    const deletedMovie = await removeMovieFromWatchlist(watchlistId, watchlistMovieId);
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

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
  const { watchlistId, watchlistMovieId } = await validateAndExtractRequestData({ locals, params });

  const result = zWatchListPatchMovie.safeParse(await request.json());

  if (!result.success) {
    return json(result.error.flatten(), { status: 400 });
  }

  const patchData = result.data;

  try {
    const patchedMovie = await patchWatchlistMovie(watchlistId, watchlistMovieId, patchData);
    return json(patchedMovie, { status: 200 });
  } catch (error) {
    if (error instanceof DatabaseError && error.message === PrismaError.REQUIRED_RECORD_NOT_FOUND) {
      return json({ error }, { status: 404 });
    }

    // TODO: Log error
    console.error(error);
  }

  return json({ error: 'An unknown error occurred' }, { status: 500 });
};

const validateAndExtractRequestData = async ({
  params,
  locals,
}: {
  locals: App.Locals;
  params: Partial<Record<string, string>>;
}): Promise<{ userId: string; watchlistId: string; watchlistMovieId: string }> => {
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

  return { userId, watchlistId, watchlistMovieId };
};
