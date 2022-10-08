import { ACCESS_TOKEN } from '$lib/constants';
import { prisma } from '$lib/server/db';
import { createJWT } from '$lib/server/util/createJWT';
import { json, type RequestHandler } from '@sveltejs/kit';
import { generateSlug } from 'random-word-slugs';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (locals.user?.id) return json({ error: 'Already logged in!' }, { status: 409 });

  // TODO: Combine this and /new/+page.server.ts into an extracted fn
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

  cookies.set(ACCESS_TOKEN, jwt, {
    expires: user.temporaryAccessExpiresOn as Date,
    path: '/',
  });

  return json(undefined, { status: 201 });
};
