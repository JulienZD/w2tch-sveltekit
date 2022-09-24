import { JWT_SECRET, JWT_EXPIRY } from '$env/static/private';
import type { User } from '@prisma/client';
import { sign as jwtSign } from 'jsonwebtoken';

export const createJWT = (user: User) => {
  return jwtSign(
    {
      sub: user.id,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );
};
