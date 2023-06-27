<script lang="ts">
  import { page } from '$app/stores';
  import Pluralize from '$lib/components/Pluralize.svelte';
  import Randomizer from '$lib/components/Randomizer.svelte';
  import InviteFormModal from '$lib/components/watchlist/invite/InviteFormModal.svelte';
  import AddMovie from '$lib/components/watchlist/movies/AddMovie.svelte';
  import Movies from '$lib/components/watchlist/movies/Movies.svelte';
  import { appModal } from '$lib/stores/modal';
  import { watchlistStore } from '$lib/stores/watchlistStore';
  import { onMount } from 'svelte';
  import { PlusIcon } from 'svelte-feather-icons';
  import type { PageData } from './$types';

  onMount(() => {
    watchlistStore.set(($page.data as PageData).watchlist);
  });

  let randomizerMode = false;
  let showAddMovieForm = false;

  const openInviteModal = async () => {
    appModal.push({
      component: InviteFormModal,
      props: {
        buttons: false,
        title: 'Create watchlist invite',
      },
    });
  };

  $: unseenMovies = $watchlistStore.movies?.filter((m) => !m.seenOn);
</script>

<div class="prose max-w-full">
  <h1>{$watchlistStore.name}</h1>
  <div class="flex text-sm gap-x-4 mb-4 items-end md:items-center justify-between md:justify-start">
    <span>List by <span class="font-semibold">{$watchlistStore.owner?.name}</span></span>
    <div class="my-0 flex flex-col gap-y-0 md:flex-row md:items-center">
      <div class="flex items-center">
        <span class="whitespace-nowrap"><Pluralize count={$watchlistStore.memberCount} word="member" /></span>
        {#if $page.data?.isOwner}
          <span data-tip="Create Invite" class="tooltip tooltip-left md:tooltip-top">
            <button on:click={openInviteModal} aria-label="Create invite" class="mx-0.5 px-1 btn btn-ghost btn-sm"
              ><PlusIcon size="20" /></button
            >
          </span>
        {/if}
      </div>
      <span class="whitespace-nowrap"><Pluralize count={$watchlistStore.movieCount} word="movie" /></span>
    </div>
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
