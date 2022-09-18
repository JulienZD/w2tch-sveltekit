<script lang="ts">
  import type { LayoutData } from './$types';
  import '../app.css';
  import TemporaryAccountAlert from '$lib/components/ui/TemporaryAccountAlert.svelte';
  import { page } from '$app/stores';

  export let data: LayoutData;
</script>

{#if !!data.temporaryAccountExpiresOn}
  <div class="container max-w-4xl fixed top-4 left-0 right-0">
    <TemporaryAccountAlert temporaryAccountExpiresOn="{data.temporaryAccountExpiresOn}" />
  </div>
{/if}

<main class="container" class:pt-24="{$page.url.pathname !== '/' && !!data.temporaryAccountExpiresOn}">
  <slot />
</main>
