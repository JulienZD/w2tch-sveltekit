<script lang="ts">
  import { browser } from '$app/environment';
  import { selectContent } from '$lib/actions/selectTextContent';
  import { ClipboardIcon } from 'svelte-feather-icons';
  import { fade } from 'svelte/transition';

  export let text: string | undefined;

  let copied = false;

  $: showClipboard = text && browser && 'clipboard' in navigator;

  const copyTextToClipboard = async () => {
    if (!text || !browser || !('clipboard' in navigator)) return;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      // No clipboard permission
    }
  };
</script>

<div class="mt-0 min-h-[2.75rem] pl-2 pr-0 rounded flex items-center overflow-x-scroll bg-base-300" class:py-2={!text}>
  <span class="whitespace-nowrap">
    {#if text}
      <span use:selectContent in:fade={{ duration: 200 }}>{text}</span>
    {/if}
  </span>
  {#if showClipboard}
    <!-- Tooltips have weird overflow behavior, always show it on the left side to prevent it hiding behind other elements -->
    <span data-tip={copied ? 'Copied!' : 'Copy'} class="tooltip tooltip-left cursor-pointer sticky right-0 bg-base-300">
      <button
        on:click={copyTextToClipboard}
        on:mouseleave={() => setTimeout(() => (copied = false), 150)}
        class="btn btn-ghost hover:bg-inherit pl-1 py-2 pr-2"
      >
        <ClipboardIcon size="20" />
      </button>
    </span>
  {/if}
</div>
