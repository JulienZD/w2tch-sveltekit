<script lang="ts">
  import type { Movie } from '@prisma/client';

  export let movies: (Movie & { seenOn: Date | null })[];
  export let view: 'list' | 'grid';
</script>

{#if view === 'grid'}
  <div class="flex flex-wrap gap-2">
    {#each movies as movie, index (movie.id)}
      <div class="card card-compact w-64 border border-secondary">
        <div class="card-body">
          <h2 class="text-center">{movie.name}</h2>
          <span class="text-center">{index + 1}</span>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <ol>
    {#each movies as movie (movie.id)}
      <li>
        <div class="flex gap-x-8">
          <span>{movie.name}</span>
          <span>{movie.imdbRating}</span>
          <span>{movie.seenOn ? 'Seen' : 'Unseen'}</span>
        </div>
      </li>
    {/each}
  </ol>
{/if}
