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

  let randomizerMode = false;
  let showAddMovieForm = false;

  $: unseenMovies = $watchlistStore.movies?.filter((m) => !m.seenOn);
</script>

<div class="prose max-w-full">
  <h1>{$watchlistStore.name}</h1>
  <div class="flex text-sm gap-x-4">
    <p>List by <span class="font-semibold">{$watchlistStore.owner?.name}</span></p>
    <p><Pluralize count={$watchlistStore.memberCount} word="member" /></p>
    <p><Pluralize count={$watchlistStore.movieCount} word="movie" /></p>
  </div>
  <div class:flex={!showAddMovieForm} class={!randomizerMode ? 'justify-between' : 'justify-end'}>
    {#if !randomizerMode}
      <button class="btn btn-primary btn-sm" on:click={() => (showAddMovieForm = !showAddMovieForm)}>
        {showAddMovieForm ? 'Hide search' : 'Add movie'}
      </button>
      <AddMovie
        addMovieCb={(movie) => watchlistStore.addMovie(movie)}
        watchlist={{
          id: $watchlistStore.id,
          movies: $watchlistStore.movies?.map((m) => m.name),
        }}
        showForm={showAddMovieForm}
      />
    {/if}
    {#if !showAddMovieForm}
      <button
        class="btn btn-sm btn-secondary"
        on:click={() => (randomizerMode = !randomizerMode)}
        disabled={!unseenMovies?.length}
        title={!unseenMovies?.length ? 'There are no unseen movies!' : ''}
        >{!randomizerMode ? 'Pick a random movie' : 'Back'}</button
      >
    {/if}
  </div>

  <div class="divider" />

  {#if randomizerMode}
    <Randomizer items={unseenMovies?.map((m) => m.name)} />
  {:else}
    <Movies movies={$watchlistStore.movies} view="list" />
  {/if}
</div>
