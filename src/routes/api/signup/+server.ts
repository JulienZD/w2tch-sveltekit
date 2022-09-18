import { prisma } from '$lib/db/client';
import type { User } from '@prisma/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { hash } from 'bcryptjs';

// Converts a user account to a permanent account
export const POST: RequestHandler = async ({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) return error(401, 'Unauthorized');

  const body = await request.json();

  const result = await z
    .object({
      name: z.string().min(1).max(32),
      password: z.string().min(8).max(128),
      email: z
        .string()
        .email()
        .refine(
          async (email) => {
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            return existingUser === null;
          },
          {
            message: 'Email already exists',
          }
        ),
    })
    .safeParseAsync(body);

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

  await convertUserToPermanent(userId, result.data);

  return json(undefined, { status: 201 });
};

const convertUserToPermanent = async (userId: string, data: Pick<User, 'email' | 'name'> & { password: string }) => {
  await prisma.$transaction([
    prisma.account.create({
      data: {
        password: await hash(data.password, 10),
        user: { connect: { id: userId } },
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: data.email,
        name: data.name,
        temporaryAccessExpiresOn: null,
      },
    }),
  ]);
};
