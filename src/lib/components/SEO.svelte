<script lang="ts">
  import { PUBLIC_APP_NAME } from '$env/static/public';
  import { tagline } from '$lib/data/seo';

  export let title = PUBLIC_APP_NAME;
  export let description = tagline;

  $: pageTitle = title === PUBLIC_APP_NAME ? title : `${title} | ${PUBLIC_APP_NAME}`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta property="og:title" content={pageTitle} />
  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
</svelte:head>
