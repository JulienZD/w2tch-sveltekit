import { Prisma } from '@prisma/client';
import { prisma } from '$lib/server/db';
import { handlePrismaClientError } from '$lib/server/db/errors';
import { randomUUID } from 'node:crypto';
import { isInviteValid } from '$lib/server/util/isInviteValid';

interface InviteCodeOptions {
  maxUsages: number;
  expiresInNDays: number;
}

const defaultOptions: InviteCodeOptions = {
  maxUsages: -1,
  expiresInNDays: 7,
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

  const { expiresInNDays, maxUsages: remainingUses } = {
    ...defaultOptions,
    ...options,
  };

  const inviteCode = await getUniqueInviteCode();
  const validUntil = getNowPlusNDays(expiresInNDays);

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
