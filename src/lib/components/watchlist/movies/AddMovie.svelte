<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import SearchMovie from './SearchMovie.svelte';

  export let watchlist: { id: string; movies: string[] };

  const dispatch = createEventDispatcher<{ added: undefined }>();

  let showForm = false;
  let selectedMovie: MovieSearchResult | null = null;

  const addMovie = async () => {
    await fetch(`/api/watchlist/${watchlist.id}/movies`, {
      method: 'POST',
      body: JSON.stringify(selectedMovie),
    });
    dispatch('added');
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = true)}>Add movie</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <div class="flex items-end gap-x-2">
      <SearchMovie on:select={(e) => (selectedMovie = e.detail)} hideResults={watchlist.movies} />

      <button class="btn btn-primary btn-square btn-sm">+</button>
    </div>
  </form>
{/if}
