<script lang="ts">
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { tagline } from '$lib/data/seo';

  export let title = PUBLIC_APP_NAME;
  export let description = tagline;
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content="{`${title} | ${PUBLIC_APP_NAME}`}" />
  <meta name="description" content="{description}" />
  <meta property="og:description" content="{description}" />
</svelte:head>
