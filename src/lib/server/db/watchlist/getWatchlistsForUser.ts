import { prisma } from '$lib/server/db';

export const getWatchlistsForUser = async (userId: string) => {
  const watchlists = await prisma.watchGroup.findMany({
    where: {
      watchers: {
        some: {
          watcherId: userId,
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

  return watchlists.map(({ _count, ...group }) => ({
    ...group,
    isOwner: group.ownerId === userId,
    memberCount: _count.watchers,
    movieCount: _count.movies,
  }));
};
