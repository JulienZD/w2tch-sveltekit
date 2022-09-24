<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let label = '';
  export let confirm = false;
  export let confirmationLabel = 'Are you sure?';

  const dispatch = createEventDispatcher<{ click: undefined }>();

  let disabled = false;
  let isConfirmationVisible = false;

  const showConfirmation = () => {
    disabled = true;
    isConfirmationVisible = true;
    setTimeout(() => {
      disabled = false;
    }, 500);
  };

  const handleClick = (event: Event) => {
    if (disabled) {
      return event.stopPropagation();
    }

    if (!confirm || isConfirmationVisible) {
      return dispatch('click');
    }

    event.stopPropagation();
    showConfirmation();
  };
</script>

<li {...$$props} class:disabled>
  <button on:click={handleClick} class="items-center" class:text-error={isConfirmationVisible}>
    <slot name="icon" />
    {#if isConfirmationVisible}
      {confirmationLabel}
    {:else}
      {label}
    {/if}
  </button>
</li>
