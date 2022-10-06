import { Prisma, type WatchlistInvite } from '@prisma/client';
import { prisma } from '..';
import { handlePrismaClientError } from '../errors';
import { randomUUID } from 'node:crypto';

interface InviteCodeOptions {
  remainingUses: number;
  validForNDays: number;
}

const defaultOptions: InviteCodeOptions = {
  remainingUses: -1,
  validForNDays: 7,
};

export const getOrCreateInviteCode = async (watchlistId: string, options?: InviteCodeOptions) => {
  try {
    return await _getOrCreateInviteCode(watchlistId, options);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw handlePrismaClientError(error);
    }
    throw error;
  }
};

const _getOrCreateInviteCode = async (watchlistId: string, options: InviteCodeOptions = defaultOptions) => {
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
    ...options,
  };

  const inviteCode = await getUniqueInviteCode();
  const validUntil = getNowPlusNDays(validForNDays);

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

const getUniqueInviteCode = async (): Promise<string> => {
  const inviteCode = randomUUID();

  const existingInviteForCode = await prisma.watchlistInvite.findFirst({
    where: {
      inviteCode,
    },
  });

  if (existingInviteForCode) {
    console.log('[getUniqueInviteCode]: Invite code already exists', existingInviteForCode);
    return getUniqueInviteCode();
  }

  return inviteCode;
};

const getNowPlusNDays = (days: number) => {
  const now = new Date();

  const validUntil = new Date(now);
  validUntil.setDate(now.getDate() + days);

  return validUntil;
};
