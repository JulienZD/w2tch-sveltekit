import { getWatchList } from '$lib/util/getWatchList';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user?.id) throw error(401);
  if (!params.slug) throw error(404);

  const watchlist = await getWatchList(params.slug, locals.user.id);

  if (!watchlist) throw error(404);

  return json({ watchlist });
};
