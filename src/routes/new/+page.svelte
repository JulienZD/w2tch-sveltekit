<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title="Create a new watchlist" />

<div class="container prose">
  <h1>Create a new watchlist</h1>
  <form>
    <div class="form-control">
      <label for="name" class="label">Watch list name</label>
      <input id="name" class="input input-bordered max-w-xs" />
    </div>
  </form>
</div>
