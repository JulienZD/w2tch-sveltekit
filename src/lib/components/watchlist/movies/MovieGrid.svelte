<script lang="ts">
  import Rating from '$lib/components/ui/Rating.svelte';
  import type { WatchlistMovie } from '$lib/models';

  export let movies: WatchlistMovie[];
</script>

<div class="flex flex-wrap gap-2">
  {#each movies as movie, index (movie.id)}
    <div class="card card-compact w-64 border border-secondary">
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
