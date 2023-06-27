<script lang="ts">
  import { browser } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import Header from '$lib/components/ui/Header.svelte';
  import TemporaryAccountAlert from '$lib/components/ui/TemporaryAccountAlert.svelte';
  import { appModal } from '$lib/stores/modal';
  import ModalPortal from '@svelte-put/modal/ModalPortal.svelte';
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
  {#if data.user}
    <Header />
  {/if}
  <main
    class={`${isHomePage ? '' : 'h-full pt-4 md:pt-32'} ${
      showTemporaryAccountBanner && !!data.temporaryAccountExpiresOn ? 'pb-20' : ''
    }`}
  >
    <slot />
  </main>
</div>

<ModalPortal store={appModal} />

<style lang="postcss">
  :global(html[data-theme='winter']) {
    @apply bg-gradient-to-tr from-transparent to-blue-300;
  }

  :global(html[data-theme='night']) {
    @apply bg-gradient-to-tr from-transparent to-blue-900;
  }

  :global(html) {
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
</style>
