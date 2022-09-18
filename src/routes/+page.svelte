<script lang="ts">
  import { tagline } from '$lib/data/seo';
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO />

<div class="hero min-h-screen">
  <div class="hero-content">
    <div class="max-w-xs sm:max-w-xl">
      <h1 class="text-3xl sm:text-5xl font-bolder">
        Create <span class="text-gradient from-red-500 to-emerald-500">Movie Watchlists</span> with ease
      </h1>
      <div class="py-6">
        <p>{tagline}</p>
        <p class="mt-2">No account required.</p>
      </div>

      <a class="btn btn-primary" href="/new">Get started</a>
    </div>
    <div class="w-56 sm:block hidden"></div>
  </div>
</div>
