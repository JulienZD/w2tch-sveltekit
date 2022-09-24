<script lang="ts">
  import Rating from '$lib/components/ui/Rating.svelte';
  import type { WatchlistMovie } from '$lib/models';
  import WatchListMovieContextMenu from './WatchListMovieContextMenu.svelte';

  export let movies: WatchlistMovie[];
</script>

<div class="flex flex-wrap gap-2">
  {#each movies as movie, index (movie.id)}
    <div class="card card-compact w-64 border border-secondary relative">
      <div class="absolute top-2 right-2 z-10">
        <WatchListMovieContextMenu variant="horizontal" {movie} />
      </div>
      <div class="card-body">
        <h2 class="text-center">{movie.name}</h2>
        <span class="text-center">{index + 1}</span>
        {#if movie.rating}
          <Rating score={movie.rating} />
        {/if}
      </div>
    </div>
  {/each}
</div>
