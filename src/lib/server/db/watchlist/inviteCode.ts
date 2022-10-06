import { Prisma, type WatchlistInvite } from '@prisma/client';
import { generateSlug } from 'random-word-slugs';
import { prisma } from '..';
import { handlePrismaClientError } from '../errors';

interface InviteCodeOptions {
  remainingUses: number;
  validForNDays: number;
}

const defaultOptions: InviteCodeOptions = {
  remainingUses: -1,
  validForNDays: 7,
};

export const getOrCreateInviteCode = async (watchlistId: string) => {
  try {
    return await _getOrCreateInviteCode(watchlistId);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }
    throw error;
  }
};

const _getOrCreateInviteCode = async (watchlistId: string, opts: InviteCodeOptions = defaultOptions) => {
  const existingInvite = await prisma.watchlistInvite.findUnique({
    where: {
      watchlistId,
    },
  });

  if (existingInvite && isInviteValid(existingInvite)) {
    return existingInvite.inviteCode;
  }

  const { validForNDays, remainingUses } = {
    ...defaultOptions,
    ...opts,
  };

  // FIXME: Ensure a unique code is generated
  const inviteCode = generateSlug(5);

  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(now.getDate() + validForNDays);

  await prisma.watchlistInvite.upsert({
    where: {
      watchlistId,
    },
    update: {
      inviteCode,
      remainingUses,
      validUntil,
    },
    create: {
      inviteCode,
      validUntil,
      watchlistId,
      remainingUses,
    },
  });

  return inviteCode;
};

const isInviteValid = (invite: WatchlistInvite): boolean => {
  return (
    (invite.remainingUses === -1 || invite.remainingUses > 0) &&
    (!invite.validUntil || invite.validUntil.getTime() >= Date.now())
  );
};
