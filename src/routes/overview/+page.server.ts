import { prisma } from '$lib/db/client';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const watchGroups = await prisma.watchGroup.findMany({
    where: {
      watchers: {
        some: {
          watcherId: locals.user?.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          watchers: true,
          movies: true,
        },
      },
    },
  });

  const mappedWatchGroups = watchGroups.map((group) => ({
    ...group,
    isOwner: group.ownerId === locals.user?.id,
  }));

  return { watchGroups: mappedWatchGroups };
};
