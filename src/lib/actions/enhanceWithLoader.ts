import { applyAction, enhance } from '$app/forms';
import type { Writable } from 'svelte/store';

export const enhanceWithLoader = (form: HTMLFormElement, isLoading: Writable<boolean>): ReturnType<typeof enhance> =>
  enhance(form, () => {
    isLoading.set(true);

    return async ({ result }) => {
      await applyAction(result);
      if (result.type !== 'redirect') {
        isLoading.set(false);
      }
    };
  });
