import { DatabaseError, PrismaError } from '$lib/server/db/errors';
import { getWatchlist } from '$lib/server/db/watchlist';
import { getOrCreateInviteCode } from '$lib/server/db/watchlist/invite';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

/**
 * Creates, re-uses, or re-generates an invite for a watchlist
 *
 * The requesting user has to be the owner of the watchlist, else a 403 is returned
 */
export const POST: RequestHandler = async ({ request, locals, url }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorized');

  const body = await request.json();

  const result = z
    .object({
      watchlistId: z.string(),
      expiresInNDays: z.number().positive(),
      maxUsages: z.literal(-1).or(z.number().positive()),
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

  const { watchlistId, ...data } = result.data;

  const watchlist = await getWatchlist(watchlistId, userId);
  if (!watchlist) {
    return json({ error: "Watchlist wasn't found" }, { status: 404 });
  }
  if (watchlist.ownerId !== userId) {
    return json({ error: 'Only watchlist owners can create invites' }, { status: 403 });
  }

  try {
    const inviteCode = await getOrCreateInviteCode(watchlistId, data);

    return json({ inviteLink: `${url.origin}/invite/${inviteCode}` });
  } catch (error) {
    // This should never happen, as we already determined the watchlist's existence prior to getting here
    if (error instanceof DatabaseError && error.message === PrismaError.NO_RELATION_FOUND) {
      return json({ error: "Watchlist wasn't found" }, { status: 404 });
    }
  }

  return json({ error: 'An unknown error occurred' }, { status: 500 });
};
