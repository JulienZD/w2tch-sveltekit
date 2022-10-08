import { ACCESS_TOKEN } from '$lib/constants';
import { prisma } from '$lib/server/db';
import { createJWT } from '$lib/server/util/createJWT';
import { invalid, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const result = z
      .object({
        password: z.string(),
        email: z.string().email(),
      })
      .safeParse({
        password: formData.get('password'),
        email: formData.get('email'),
      });

    if (!result.success) {
      return invalid(400, result.error.flatten());
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
      throw invalid(401, { unauthorized: true });
    }

    const { account, ...user } = dbResult;

    if (!account || !(await bcrypt.compare(result.data.password, account.password))) {
      throw invalid(401, { unauthorized: true });
    }

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const jwt = createJWT(user);

    cookies.set(ACCESS_TOKEN, jwt, {
      expires: oneMonthFromNow,
      path: '/',
    });

    const returnUrlResult = z.string().startsWith('/').safeParse(formData.get('returnUrl'));
    if (returnUrlResult.success) {
      throw redirect(302, returnUrlResult.data);
    }

    return { user };
  },
};
