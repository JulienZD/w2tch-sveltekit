import { getWatchlist } from '$lib/server/db/watchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user?.id) throw error(401);
  if (!params.slug) throw error(404);

  const watchlist = await getWatchlist(params.slug, locals.user.id);

  if (!watchlist) throw error(404);

  return json({ watchlist });
};
