<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createItemsCache } from '$lib/stores/itemsCache';
  import { createEventDispatcher } from 'svelte';
  import SearchMovie from './SearchMovie.svelte';

  export let watchlist: { id: string; movies: string[] };

  const resultsCache = createItemsCache();

  const dispatch = createEventDispatcher<{ added: undefined }>();

  let showForm = false;
  let selectedMovie: MovieSearchResult | null = null;

  const addMovie = async () => {
    if (!selectedMovie) return;

    await fetch(`/api/watchlist/${watchlist.id}/movies`, {
      method: 'POST',
      body: JSON.stringify(selectedMovie),
    });
    dispatch('added');
    selectedMovie = null;
    resultsCache.set([]);
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = true)}>Add movie</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <div class="flex items-end gap-x-2">
      <SearchMovie
        resultsStore={resultsCache}
        on:select={(e) => (selectedMovie = e.detail)}
        excludeResults={watchlist.movies}
      />

      <button class="btn btn-primary btn-square btn-sm">+</button>
    </div>
  </form>
{/if}
