<script lang="ts">
  import { pagesWithoutHeader } from '$lib/data/pages';
  import { page } from '$app/stores';
  import Theme from '$lib/components/ui/Theme.svelte';

  let showHeader = false;
  $: {
    const pagesWithSlugs = pagesWithoutHeader.filter((p) => p.endsWith('/*')).map((p) => p.replace('/*', ''));

    const isSpecialPage =
      pagesWithoutHeader.includes($page.url.pathname) || pagesWithSlugs.some((p) => $page.url.pathname.startsWith(p));

    showHeader = !isSpecialPage;
  }
</script>

{#if showHeader}
  <header class="absolute right-4 top-4 md:top-32">
    <Theme />
  </header>
{/if}
