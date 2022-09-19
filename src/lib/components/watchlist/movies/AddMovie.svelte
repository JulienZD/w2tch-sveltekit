<script lang="ts">
  import type { Movie } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import SearchMovie from './SearchMovie.svelte';

  const dispatch = createEventDispatcher<{ added: Movie }>();

  let errors: Record<string, string> = {};
  let showForm = false;
  let name = '';
  // FIXME: Type based on external movies API
  let selectedMovie: unknown;

  const addMovie = async () => {
    console.log('addMovie', selectedMovie);
    // TODO: Add
    // await fetch('/api/watchlist/${watchlist.id}/movies', {
    //   method: 'POST',
    //   body: JSON.stringify(selectedMovie),
    // });
    dispatch('added', {
      name,
    } as Movie);
  };
</script>

<button class="btn btn-primary btn-sm" on:click={() => (showForm = true)}>Add movie</button>

{#if showForm}
  <form on:submit|preventDefault={addMovie}>
    <SearchMovie on:selected={addMovie} />
    <div class="flex items-end gap-x-2">
      <div class="form-control">
        <label for="name" class="label">Search Movie</label>
        <input
          id="name"
          bind:value={name}
          required
          class:border-error={errors.name}
          class="input input-bordered max-w-xs"
          placeholder="Interstellar"
        />
        {#if errors.name}
          <p class="my-0 text-error text-sm">{errors.name}</p>
        {/if}
      </div>

      <button class="btn btn-primary btn-square btn-sm">+</button>
    </div>
  </form>
{/if}
