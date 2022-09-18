import { USER_ID_COOKIE } from '$lib/constants';
import { prisma } from '$lib/db/client';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const userId = event.cookies.get(USER_ID_COOKIE);
  if (!userId) {
    return resolve(event);
  }

  event.locals.user =
    (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) ?? undefined;

  return resolve(event);
};
