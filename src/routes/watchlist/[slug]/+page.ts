import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const response = await fetch(`/api/watchlist/${params.slug}`);

  return response.json();
};
