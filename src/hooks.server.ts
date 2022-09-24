import { USER_ID_COOKIE } from '$lib/constants';
import { prisma } from '$lib/server/db';
import { JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { verify as jwtVerify, type JwtPayload } from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
  const jwt = event.cookies.get(USER_ID_COOKIE);
  if (!jwt) {
    return resolve(event);
  }

  let decodedJWT: JwtPayload;
  try {
    decodedJWT = jwtVerify(jwt, JWT_SECRET) as JwtPayload;
  } catch {
    return resolve(event);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedJWT.sub,
    },
  });

  if (user) {
    event.locals.user = user;
  }

  return resolve(event);
};
