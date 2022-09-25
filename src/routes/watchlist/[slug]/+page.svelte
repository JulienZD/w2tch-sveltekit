<script lang="ts">
  import { page } from '$app/stores';
  import Pluralize from '$lib/components/Pluralize.svelte';
  import Randomizer from '$lib/components/Randomizer.svelte';
  import AddMovie from '$lib/components/watchlist/movies/AddMovie.svelte';
  import Movies from '$lib/components/watchlist/movies/Movies.svelte';
  import { watchlistStore } from '$lib/stores/watchlistStore';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  onMount(() => {
    watchlistStore.set(($page.data as PageData).watchlist);
  });
</script>

<!-- <Randomizer items={watchlist.movies.map((m) => m.name)} /> -->
<div class="prose max-w-full">
  <h1>{$watchlistStore.name}</h1>
  <div class="flex text-sm gap-x-4">
    <p>List by <span class="font-semibold">{$watchlistStore.owner?.name}</span></p>
    <p><Pluralize count={$watchlistStore.memberCount} word="member" /></p>
    <p><Pluralize count={$watchlistStore.movieCount} word="movie" /></p>
  </div>
  <AddMovie
    addMovieCb={(movie) => watchlistStore.addMovie(movie)}
    watchlist={{ id: $watchlistStore.id, movies: $watchlistStore.movies?.map((m) => m.name) }}
  />
  <div class="divider" />
  <Movies movies={$watchlistStore.movies} view="list" />
</div>
