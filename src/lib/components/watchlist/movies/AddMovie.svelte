<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import SearchMovie from './SearchMovie.svelte';

  export let watchlist: { id: string; movies: string[] };

  const movieSearchStore = writable<{ results: MovieSearchResult[]; selection?: MovieSearchResult }>({
    results: [],
    selection: undefined,
  });

  const dispatch = createEventDispatcher<{ added: undefined }>();

  let showForm = false;
  let isSaving = false;

  const addMovie = async () => {
    if (!$movieSearchStore.selection || isSaving) return;

    isSaving = true;
    const response = await fetch(`/api/watchlist/${watchlist.id}/movies`, {
      method: 'POST',
      body: JSON.stringify($movieSearchStore.selection),
    });
    isSaving = false;
    if (!response.ok) {
      return;
    }

    dispatch('added');

    // Remove the selected item from the results so they can be reused
    movieSearchStore.update((current) => ({
      ...current,
      results: current.results.filter((r) => r.id !== current.selection?.id),
    }));
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = !showForm)}>
  {showForm ? 'Hide search' : 'Add movie'}
</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <div class="flex items-end gap-x-2">
      <SearchMovie autoFocusOnMount {movieSearchStore} excludeResults={watchlist.movies} />

      <button class="btn btn-primary btn-square btn-sm" class:loading={isSaving}>
        {isSaving ? '' : '+'}
      </button>
    </div>
  </form>
{/if}
