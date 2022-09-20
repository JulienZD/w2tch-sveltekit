import { prisma } from '$lib/db/client';
import { zWatchListCreate } from '$lib/models/watchlist';
import { error, json, type RequestHandler } from '@sveltejs/kit';

// Creates a Watchlist for the authenticated user. Automatically joins that user to the watch group
export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) throw error(401, 'Unauthorized');

  const body = await request.json();

  const result = zWatchListCreate.safeParse(body);
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

  const watchList = await prisma.watchGroup.create({
    data: {
      owner: { connect: { id: userId } },
      watchers: { create: { watcherId: userId } },
      name: result.data.name,
    },
  });

  return json(
    {
      id: watchList.id,
    },
    { status: 201 }
  );
};
