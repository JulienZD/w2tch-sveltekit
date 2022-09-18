import { prisma } from '$lib/db/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { USER_ID_COOKIE } from '$lib/constants';

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

  cookies.set(USER_ID_COOKIE, user.id, {
    expires: oneMonthFromNow,
    path: '/',
  });

  return json(user, { status: 201 });
};
