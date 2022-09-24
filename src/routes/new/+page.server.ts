import { USER_ID_COOKIE } from '$lib/constants';
import { prisma } from '$lib/server/db';
import { createJWT } from '$lib/server/util/createJWT';
import { generateSlug } from 'random-word-slugs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (locals.user) {
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: generateSlug(2, {
        format: 'title',
        categories: {
          adjective: ['personality'],
          noun: ['animals'],
        },
      }),
    },
  });

  const jwt = createJWT(user);

  cookies.set(USER_ID_COOKIE, jwt, {
    expires: user.temporaryAccessExpiresOn as Date,
    path: '/',
  });
};
