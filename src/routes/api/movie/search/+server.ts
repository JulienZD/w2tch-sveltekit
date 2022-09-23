import { movieDBClient } from '$lib/server/providers/moviedb/api';
import { error as kitError, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw kitError(401, 'Unauthorized');

  const query = url.searchParams.get('query');
  if (!query) throw kitError(400, 'Missing query param');

  const { error, data: movies } = await movieDBClient.searchMovies(query);

  if (error) {
    // FIXME: We should know what the status code / message should be
    //  refactor the error prop to include this
    throw kitError(500, 'An unknown error occurred');
  }

  return json({ movies });
};
