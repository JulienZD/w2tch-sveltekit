<script lang="ts">
  import type { Movie, MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import SearchMovie from './SearchMovie.svelte';

  const dispatch = createEventDispatcher<{ added: Movie }>();

  let showForm = false;
  let name = '';
  let selectedMovie: MovieSearchResult | null = null;

  const addMovie = async () => {
    console.log('addMovie', selectedMovie);
    // TODO: Implement
    // await fetch('/api/watchlist/${watchlist.id}/movies', {
    //   method: 'POST',
    //   body: JSON.stringify(selectedMovie),
    // });
    dispatch('added', {
      name,
    } as Movie);
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = true)}>Add movie</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <div class="flex items-end gap-x-2">
      <SearchMovie on:select={(e) => (selectedMovie = e.detail)} />

      <button class="btn btn-primary btn-square btn-sm">+</button>
    </div>
  </form>
{/if}
