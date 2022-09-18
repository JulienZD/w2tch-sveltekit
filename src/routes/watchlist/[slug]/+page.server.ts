import { prisma } from '$lib/db/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const watchlist = await prisma.watchGroup.findFirst({
    where: {
      id: params.slug,
      OR: [
        {
          watchers: {
            some: {
              watcherId: locals.user?.id,
            },
          },
        },
        {
          ownerId: locals.user?.id,
        },
      ],
    },
  });

  if (!watchlist) {
    throw error(404, 'Not Found');
  }

  return { watchlist };
};
