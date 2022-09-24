import { ACCESS_TOKEN } from '$lib/constants';
import { prisma } from '$lib/server/db';
import { createJWT } from '$lib/server/util/createJWT';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();

  const result = z
    .object({
      password: z.string(),
      email: z.string().email(),
    })
    .safeParse(body);

  if (!result.success) {
    return json(
      {
        error: result.error.flatten(),
      },
      {
        status: 400,
      }
    );
  }

  const dbResult = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
    include: {
      account: true,
    },
  });

  if (!dbResult) {
    throw error(401, 'Unauthorized');
  }

  const { account, ...user } = dbResult;

  if (!account || !(await bcrypt.compare(result.data.password, account.password))) {
    throw error(401, 'Unauthorized');
  }

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const jwt = createJWT(user);

  cookies.set(ACCESS_TOKEN, jwt, {
    expires: oneMonthFromNow,
    path: '/',
  });

  return json(user, { status: 201 });
};
