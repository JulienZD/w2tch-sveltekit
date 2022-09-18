import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect users that have already signed up
  if (locals.user?.email) {
    throw redirect(302, '/');
  }

  return locals;
};
