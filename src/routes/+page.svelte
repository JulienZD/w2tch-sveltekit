<script lang="ts">
  import { tagline } from '$lib/data/seo';
  import SEO from '$lib/components/SEO.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SEO />

<div class="hero min-h-screen">
  <div class="hero-content">
    <div class="max-w-xs sm:max-w-xl">
      <h1 class="text-3xl sm:text-5xl font-bolder">
        Create <span class="text-gradient from-red-500 to-emerald-500">Movie Watchlists</span> with ease
      </h1>
      <div class="py-6">
        {#if data.user}
          <p>Welcome back, {data.user.name}</p>
        {:else}
          <p>{tagline}</p>
          <p class="mt-2">No account required.</p>
        {/if}
      </div>
      {#if data.user}
        <a class="mt-2 btn btn-primary" href="/overview">To my watch lists</a>
      {:else}
        <a class="btn btn-primary" href="/new">Get started</a>
        <p class="text-sm mt-2">Already have an account? <a class="link-primary" href="/login">Login</a></p>
      {/if}
    </div>
    <div class="w-56 sm:block hidden" />
  </div>
</div>
