<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import Pluralize from '$lib/components/Pluralize.svelte';
  import AddMovie from '$lib/components/watchlist/movies/AddMovie.svelte';
  import Movies from '$lib/components/watchlist/movies/Movies.svelte';
  import type { PageData } from './$types';

  $: ({ watchlist } = $page.data as PageData);

  const refresh = () => {
    invalidate(`/api/watchlist/${$page.params.slug}`);
  };
</script>

<div class="prose">
  <h1>{watchlist.name}</h1>
  <div class="flex text-sm gap-x-4">
    <p>List by <span class="font-semibold">{watchlist.owner.name}</span></p>
    <p><Pluralize count={watchlist.memberCount} word="member" /></p>
    <p><Pluralize count={watchlist.movieCount} word="movie" /></p>
  </div>
  <AddMovie watchlistId={watchlist.id} on:added={refresh} />
  <div class="divider" />
  <Movies movies={watchlist.movies} view="list" />
</div>
