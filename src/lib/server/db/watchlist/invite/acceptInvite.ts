import { isInviteValid } from '$lib/server/util/isInviteValid';
import { Prisma, type PrismaPromise, type WatchlistInvite } from '@prisma/client';
import { prisma } from '../..';
import { handlePrismaClientError } from '../../errors';

export const acceptInvite = async (inviteCode: string, userId: string) => {
  try {
    return await _acceptInvite(inviteCode, userId);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }
    throw error;
  }
};

const _acceptInvite = async (inviteCode: string, userId: string) => {
  const invite = await prisma.watchlistInvite.findFirst({
    where: { inviteCode },
  });

  if (!invite || !isInviteValid(invite)) {
    throw new Error('Invite invalid');
  }

  const prismaOperations: PrismaPromise<unknown>[] = [addUserToWatchlist(invite.watchlistId, userId)];

  if (invite.remainingUses > 0) {
    prismaOperations.push(decrementInviteUses(invite));
  }

  await prisma.$transaction(prismaOperations);
};

const addUserToWatchlist = (watchlistId: string, userId: string) =>
  prisma.watchGroup.update({
    where: { id: watchlistId },
    data: {
      watchers: {
        create: {
          watcherId: userId,
        },
      },
    },
  });

const decrementInviteUses = (invite: WatchlistInvite) => {
  const newUses = invite.remainingUses === -1 ? -1 : invite.remainingUses - 1;

  return prisma.watchlistInvite.update({
    where: { watchlistId: invite.watchlistId },
    data: { remainingUses: newUses },
  });
};
