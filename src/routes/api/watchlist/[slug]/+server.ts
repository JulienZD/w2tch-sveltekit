import { getWatchlist } from '$lib/server/db/watchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401);
  if (!params.slug) throw error(404);

  const watchlist = await getWatchlist(params.slug, userId);

  if (!watchlist) throw error(404);

  return json({ watchlist, isOwner: watchlist.ownerId === userId });
};
