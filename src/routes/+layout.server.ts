import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  return {
    user: locals.user
      ? {
          name: locals.user.name,
          email: locals.user.email,
        }
      : undefined,
    temporaryAccountExpiresOn: locals.user?.temporaryAccessExpiresOn,
  };
};
