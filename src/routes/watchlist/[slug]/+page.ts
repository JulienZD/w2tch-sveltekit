import type { Watchlist } from '$lib/models';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const response = await fetch(`/api/watchlist/${params.slug}`);

  if (!response.ok) throw error(response.status, response.statusText);

  // There's no inferred type for the result of the call to the relative API route, so we have to cast it ourselves
  return response.json() as Promise<{ watchlist: Watchlist }>;
};
