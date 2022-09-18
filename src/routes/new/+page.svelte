<script lang="ts">
  import { goto } from '$app/navigation';
  import SEO from '$lib/components/SEO.svelte';

  let name: string = '';
  let errors: Record<string, string> = {};

  const createWatchList = async () => {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    });
    if (!response.ok) {
      const { error } = await response.json();
      errors = error.fieldErrors;
      return;
    }

    const { id } = await response.json();
    goto(`/watchlist/${id}`);
  };
</script>

<SEO title="Create a new watchlist" />

<div class="container prose">
  <h1>Create a new watchlist</h1>
  <form on:submit|preventDefault={createWatchList}>
    <div class="form-control">
      <label for="name" class="label">Watch list name</label>
      <input
        id="name"
        bind:value={name}
        required
        class:border-error={errors.name}
        class="input input-bordered max-w-xs"
        placeholder="Favorites"
      />
      {#if errors.name}
        <p class="my-0 text-error text-sm">{errors.name}</p>
      {/if}
    </div>

    <button class="btn btn-primary mt-2">Create</button>
  </form>
</div>
