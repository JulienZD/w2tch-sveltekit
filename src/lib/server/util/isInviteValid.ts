import type { WatchlistInvite } from '.prisma/client';

export const isInviteValid = (invite: WatchlistInvite): boolean => {
  return (
    (invite.remainingUses === -1 || invite.remainingUses > 0) &&
    (!invite.validUntil || invite.validUntil.getTime() >= Date.now())
  );
};
