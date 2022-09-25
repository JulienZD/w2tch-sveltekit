<script lang="ts">
  import type { MovieSearchResult, WatchlistMovie } from '$lib/models';
  import type { ApiResult } from '$lib/util/api';
  import { writable } from 'svelte/store';
  import SearchMovie from './SearchMovie.svelte';

  export let watchlist: { id: string; movies: string[] };
  export let addMovieCb: (movie: MovieSearchResult) => Promise<ApiResult<WatchlistMovie>>;

  const movieSearchStore = writable<{ results: MovieSearchResult[]; selection?: MovieSearchResult }>({
    results: [],
    selection: undefined,
  });

  let showForm = false;
  let isSaving = false;

  const addMovie = async () => {
    if (!$movieSearchStore.selection || isSaving) return;

    isSaving = true;

    const result = await addMovieCb($movieSearchStore.selection);

    if (result.success) {
      // Remove the selected item from the results so they can be reused
      movieSearchStore.update((current) => ({
        ...current,
        results: current.results.filter((r) => r.id !== current.selection?.id),
      }));
    }
    isSaving = false;
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
