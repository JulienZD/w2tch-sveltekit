import { DatabaseError, PrismaError } from '$lib/server/db/errors';
import { getWatchlist } from '$lib/server/db/watchlist';
import { acceptInvite, getInvite } from '$lib/server/db/watchlist/invite';
import { error, invalid } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) throw error(401, 'Unauthorized');

  const inviteCode = params.code;
  if (!inviteCode) throw error(404, 'no code');
  const invite = await getInvite(inviteCode);

  let isExistingMember = false;
  if (invite) {
    const watchlist = await getWatchlist(invite?.watchlist.id, locals.user.id);
    isExistingMember = !!watchlist;
  }

  return { invite, isExistingMember };
};

export const actions: Actions = {
  acceptInvite: async (event) => {
    const { locals, request } = event;
    if (!locals.user) throw error(401, 'Unauthorized');

    const formData = await request.formData();

    const result = z.string().safeParse(formData.get('code'));
    if (!result.success) {
      return invalid(400, { error: 'Invalid code' });
    }

    try {
      await acceptInvite(result.data, locals.user.id);
      return { success: true };
    } catch (error) {
      if (error instanceof DatabaseError && error.message === PrismaError.UNIQUE_CONSTRAINT) {
        return invalid(409, { error: "You're already part of this watchlist" });
      }
      if (error instanceof Error) {
        return invalid(500, { error: error.message });
      }
      return invalid(500, { error: 'An unknown error occurred' });
    }
  },
};
