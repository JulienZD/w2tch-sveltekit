<script lang="ts">
  export let label = '';
</script>

<li {...$$props}>
  <button on:click class="">
    <slot name="icon" />
    {label}
  </button>
</li>
