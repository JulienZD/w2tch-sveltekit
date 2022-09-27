<script lang="ts">
  import Rating from '$lib/components/ui/Rating.svelte';
  import SeenBadge from '$lib/components/ui/SeenBadge.svelte';
  import type { WatchlistMovie } from '$lib/models';
  import WatchListMovieContextMenu from './WatchListMovieContextMenu.svelte';

  export let movies: WatchlistMovie[];
</script>

<table class="table">
  {#each movies as movie, index (movie.id)}
    <tr class="table-row md:hidden hover:bg-base-100/50">
      <td>{index + 1}</td>
      <td class="w-full">
        <div class="w-full inline-flex justify-between items-center gap-x-4">
          <div class="inline-flex flex-col">
            <span class="whitespace-pre-wrap">{movie.name}</span>
            {#if movie.rating}
              <Rating score={movie.rating} />
            {/if}
          </div>
          <SeenBadge seenOn={movie.seenOn} />
        </div>
      </td>
      <td class="not-prose">
        <WatchListMovieContextMenu variant="vertical" {movie} />
      </td>
    </tr>
    <tr class="hidden md:table-row hover:bg-base-100/50">
      <td>{index + 1}</td>
      <td>
        {movie.name}
      </td>
      <td>
        {#if movie.rating}
          <Rating score={movie.rating} />
        {/if}
      </td>
      <td>
        <div class="w-full h-full inline-flex justify-end items-center">
          <SeenBadge seenOn={movie.seenOn} />
        </div>
      </td>
      <td class="not-prose">
        <WatchListMovieContextMenu variant="inline" {movie} />
      </td>
    </tr>
  {/each}
</table>
