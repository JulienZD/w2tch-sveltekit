<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import SearchMovie from './SearchMovie.svelte';

  export let watchlist: { id: string; movies: string[] };

  const resultsCache = writable([]);

  const dispatch = createEventDispatcher<{ added: undefined }>();

  let showForm = false;
  let selectedMovie: MovieSearchResult | null = null;

  let isSaving = false;
  const addMovie = async () => {
    if (!selectedMovie || isSaving) return;

    isSaving = true;
    await fetch(`/api/watchlist/${watchlist.id}/movies`, {
      method: 'POST',
      body: JSON.stringify(selectedMovie),
    });
    dispatch('added');
    selectedMovie = null;
    resultsCache.set([]);
    isSaving = false;
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = !showForm)}>
  {showForm ? 'Hide search' : 'Add movie'}
</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <div class="flex items-end gap-x-2">
      <SearchMovie
        autoFocusOnMount
        resultsStore={resultsCache}
        initialValue={selectedMovie}
        on:select={(e) => (selectedMovie = e.detail)}
        excludeResults={watchlist.movies}
      />

      <button class="btn btn-primary btn-square btn-sm" class:loading={isSaving}>
        {isSaving ? '' : '+'}
      </button>
    </div>
  </form>
{/if}
