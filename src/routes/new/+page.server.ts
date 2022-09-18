import { USER_ID_COOKIE } from '$lib/constants';
import { prisma } from '$lib/db/client';
import type { PageServerLoad } from './$types';
import { generateSlug } from 'random-word-slugs';

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

  cookies.set(USER_ID_COOKIE, user.id, {
    expires: user.temporaryAccessExpiresOn,
    path: '/',
  });
};
