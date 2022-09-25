<script lang="ts">
  import type { Movie } from '$lib/models';
  import MovieGrid from './MovieGrid.svelte';
  import MovieList from './MovieList.svelte';

  export let movies: (Movie & { seenOn: Date | null })[] = [];
  export let view: 'list' | 'grid';
</script>

{#if view === 'grid'}
  <MovieGrid {movies} />
{:else}
  <MovieList {movies} />
{/if}
