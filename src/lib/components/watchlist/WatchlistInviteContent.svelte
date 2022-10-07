<script lang="ts">
  import { fade } from 'svelte/transition';

  export let title: string;
</script>

<div class="h-full grid place-content-center prose">
  <div class="p-10 shadow-md rounded-3xl bg-base-200">
    {#key title}
      <div class="grid place-content-center" in:fade>
        <h1>{title}</h1>

        <slot />
      </div>
    {/key}
  </div>
</div>
