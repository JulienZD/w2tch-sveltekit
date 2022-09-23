import { getWatchlistsForUser } from '$lib/server/db/watchlist';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user?.id) throw error(401);

  const watchGroups = await getWatchlistsForUser(locals.user.id);

  return { watchGroups };
};
