import type { PageServerLoad } from './$types';
import { prisma } from '$lib/db/client';

export const load: PageServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');

  if (!email) {
    return {
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return {
    user,
  };
};
