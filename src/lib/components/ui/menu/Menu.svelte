<script lang="ts">
  import { clickOutside } from '$lib/actions/clickOutside';
  import { MoreHorizontalIcon, MoreVerticalIcon } from 'svelte-feather-icons';
  import { quadInOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { afterUpdate, onDestroy } from 'svelte';

  export let variant: 'horizontal' | 'vertical' = 'vertical';

  let menuRef: HTMLUListElement;

  let opened = false;

  const close = () => {
    opened = false;
  };

  const openOrClose = () => {
    opened = !opened;
  };

  afterUpdate(() => {
    if (!menuRef) return;

    const nodes = Array.from(menuRef.children);
    nodes.forEach((node) => {
      if (opened) {
        node.addEventListener('click', close);
      } else {
        node.removeEventListener('click', close);
      }
    });
  });

  onDestroy(() => {
    if (menuRef) {
      Array.from(menuRef.children).forEach((node) => {
        node.removeEventListener('click', close);
      });
    }
  });
</script>

<div class="relative not-prose">
  <button class="btn btn-sm btn-ghost rounded-box transition-colors" on:click={openOrClose}>
    {#if variant === 'horizontal'}
      <MoreHorizontalIcon size="20" />
    {:else}
      <MoreVerticalIcon size="20" />
    {/if}
  </button>

  {#if opened}
    <ul
      use:clickOutside
      on:clickoutside={close}
      bind:this={menuRef}
      transition:fly={{ duration: 200, easing: quadInOut }}
      class="menu md:menu-normal bg-base-100 shadow-md min-w-[10rem] rounded-box absolute top-6 right-4 z-50 whitespace-nowrap"
    >
      <slot />
    </ul>
  {/if}
</div>

<style lang="postcss">
  :global(.menu li:only-child, .menu li:only-child > *) {
    border-radius: inherit !important;
  }
</style>
