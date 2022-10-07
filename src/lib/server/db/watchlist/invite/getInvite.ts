import { isInviteValid } from '$lib/server/util/isInviteValid';
import { Prisma } from '@prisma/client';
import { prisma } from '../..';
import { handlePrismaClientError } from '../../errors';

export const getInvite = async (inviteCode: string) => {
  try {
    return await _getInvite(inviteCode);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }
    throw error;
  }
};

const _getInvite = async (inviteCode: string) => {
  const invite = await prisma.watchlistInvite.findFirst({
    where: { inviteCode },
    include: {
      watchlist: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              movies: true,
              watchers: true,
            },
          },
        },
      },
    },
  });

  if (!invite || !isInviteValid(invite)) {
    return null;
  }

  const { owner: inviter, _count, ...watchlist } = invite.watchlist;

  return {
    code: invite.inviteCode,
    watchlist: {
      ...watchlist,
      movieCount: _count.movies,
      memberCount: _count.watchers,
    },
    invitedBy: inviter.name,
  };
};
