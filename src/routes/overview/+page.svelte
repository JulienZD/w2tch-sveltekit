<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/components/SEO.svelte';
  import { goto } from '$app/navigation';
  import Pluralize from '$lib/components/Pluralize.svelte';

  export let data: PageData;
</script>

<SEO />

<div class="prose">
  <h1>Your watchlists</h1>
  <p>These are all the watch groups you own or are a member of.</p>
  <a class="btn btn-primary btn-sm mb-4" href="/new">Create new</a>
  <div class="flex flex-wrap gap-4 w-full">
    {#each data.watchGroups as watchGroup}
      <div
        class="card card-compact glass cursor-pointer w-full md:w-64"
        on:click={() => goto(`/watchlist/${watchGroup.id}`)}
      >
        <div class="card-body">
          <h2 class="card-title">
            {watchGroup.name}
            {#if watchGroup.isOwner}
              <div class="badge badge-ghost">owner</div>
            {/if}
          </h2>
          <Pluralize word="member" count={watchGroup.memberCount} />
          <Pluralize word="movie" count={watchGroup.movieCount} />
        </div>
      </div>
    {/each}
  </div>
</div>
