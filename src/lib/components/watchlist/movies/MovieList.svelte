<script lang="ts">
  import SeenBadge from '$lib/components/ui/SeenBadge.svelte';
  import type { WatchlistMovie } from '$lib/models';
  import { StarIcon } from 'svelte-feather-icons';

  export let movies: WatchlistMovie[];
</script>

<div class="max-w-xl">
  <table class="table">
    {#each movies as movie, index (movie.id)}
      <tr class="table-row md:hidden hover cursor-pointer">
        <td>{index + 1}</td>
        <td class="w-full">
          <div class="w-full inline-flex justify-between items-center gap-x-4">
            <div class="inline-flex flex-col">
              <span>{movie.name}</span>
              <span class="flex items-center gap-x-1">
                <StarIcon class="fill-current" size="15" />{movie.imdbRating}
              </span>
            </div>
            <SeenBadge seenOn={movie.seenOn} />
          </div>
        </td>
      </tr>
      <tr class="hidden md:table-row hover cursor-pointer">
        <td>{index + 1}</td>
        <td>
          {movie.name}
        </td>
        <td>
          <span class="flex items-center gap-x-1">
            <StarIcon class="fill-current" size="15" />{movie.imdbRating}
          </span>
        </td>
        <td>
          <SeenBadge seenOn={movie.seenOn} />
        </td>
      </tr>
    {/each}
  </table>
</div>
