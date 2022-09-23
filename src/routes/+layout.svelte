<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import TemporaryAccountAlert from '$lib/components/ui/TemporaryAccountAlert.svelte';
  import Theme from '$lib/components/ui/Theme.svelte';
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';
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
  $: showTemporaryAccountBanner = !['/', '/signup', 'login'].includes($page.url.pathname);

  $: isHomePage = $page.url.pathname === '/';

  onMount(() => {
    if (isHomePage) {
      themeChange(false);
    }
  });
</script>

{#if showTemporaryAccountBanner && !!data.temporaryAccountExpiresOn}
  <div class="container px-2 md:px-0 max-w-4xl fixed bottom-4 left-0 right-0 z-50">
    <TemporaryAccountAlert temporaryAccountExpiresOn={data.temporaryAccountExpiresOn} />
  </div>
{/if}

<div class={`container px-2 md:px-0 h-full relative ${isHomePage ? '' : 'max-w-none md:max-w-3xl md:mx-auto'}`}>
  {#if data.user && !isHomePage}
    <header class="absolute right-4 top-4 md:top-32">
      <Theme />
    </header>
  {/if}
  <main
    class={`${isHomePage ? '' : 'pt-4 md:pt-32'} ${
      showTemporaryAccountBanner && !!data.temporaryAccountExpiresOn ? 'pb-20' : ''
    }`}
  >
    <slot />
  </main>
</div>

<style lang="postcss">
  :global(html[data-theme='winter']) {
    @apply bg-gradient-to-tr from-transparent to-blue-300;
  }

  :global(html[data-theme='night']) {
    @apply bg-gradient-to-tr from-transparent to-blue-900;
  }
</style>
