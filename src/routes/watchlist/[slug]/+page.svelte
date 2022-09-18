<script lang="ts">
  import Pluralize from '$lib/components/Pluralize.svelte';
  import Movies from '$lib/components/watchlist/movies/Movies.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const { watchlist } = data;

  let view: 'list' | 'grid' = 'grid';

  // watchlist.movies is the join table
  $: movies = watchlist.movies.map((m) => ({
    ...m.movie,
    seenOn: m.seenOn,
  }));
</script>

<div class="prose max-w-none">
  <h1>{watchlist.name}</h1>
  <div class="flex text-sm gap-x-4">
    <p>List by <span class="font-semibold">{watchlist.owner.name}</span></p>
    <p><Pluralize count={watchlist._count.watchers} word="member" /></p>
    <p><Pluralize count={watchlist._count.movies} word="movie" /></p>
  </div>
  <button class="btn btn-sm btn-secondary min-w-[6rem]" on:click={() => (view = view === 'list' ? 'grid' : 'list')}>
    {view === 'list' ? 'grid' : 'list'} view</button
  >
  <div class="divider" />
  <Movies {movies} {view} />
</div>
