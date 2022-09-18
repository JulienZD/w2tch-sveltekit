<script lang="ts">
  import type { PageData } from './$types';
  import SEO from '$lib/components/SEO.svelte';
  import pluralize from 'pluralize';
  import { goto } from '$app/navigation';

  export let data: PageData;
</script>

<SEO />

<div class="prose p-16 max-w-none">
  <h1>Your watchlists</h1>
  <p>These are all the watch groups you own or are a member of.</p>
  <div class="flex flex-wrap gap-2 w-full">
    {#each data.watchGroups as watchGroup}
      <div class="card card-compact glass w-80 cursor-pointer" on:click={() => goto(`/watchlist/${watchGroup.id}`)}>
        <div class="card-body">
          <h2 class="card-title">
            {watchGroup.name}
            {#if watchGroup.isOwner}
              <div class="badge badge-ghost">owner</div>
            {/if}
          </h2>
          <div>{watchGroup._count.watchers} {pluralize('member', watchGroup._count.watchers)}</div>
          <div>{watchGroup._count.movies} {pluralize('movie', watchGroup._count.movies)}</div>
        </div>
      </div>
    {/each}
  </div>
</div>
