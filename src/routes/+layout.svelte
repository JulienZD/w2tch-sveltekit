<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import TemporaryAccountAlert from '$lib/components/ui/TemporaryAccountAlert.svelte';
  import '../app.css';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: {
    // Invalidate all `load` results (mostly done to refresh the auth state)
    if (browser && $page.url.searchParams.get('reload') === '1') {
      $page.url.searchParams.delete('reload');
      invalidateAll().then(() =>
        goto($page.url.href, {
          replaceState: true,
        })
      );
    }
  }
</script>

{#if !!data.temporaryAccountExpiresOn}
  <div class="container px-2 md:px-0 max-w-4xl fixed bottom-4 left-0 right-0">
    <TemporaryAccountAlert temporaryAccountExpiresOn={data.temporaryAccountExpiresOn} />
  </div>
{/if}

<main
  class={`container h-full ${$page.url.pathname !== '/' ? 'max-w-none md:max-w-3xl md:mx-auto' : ''}`}
  class:pt-24={$page.url.pathname !== '/' && !!data.temporaryAccountExpiresOn}
>
  <slot />
</main>
