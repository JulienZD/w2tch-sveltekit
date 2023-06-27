<script lang="ts">
  import { browser } from '$app/environment';
  import { selectContent } from '$lib/actions/selectTextContent';
  import { fade } from 'svelte/transition';

  export let text: string | undefined;

  let copied = false;
  let timeout: NodeJS.Timeout;

  $: showClipboard = text && browser && 'clipboard' in navigator;

  const copyTextToClipboard = async () => {
    if (!text || !browser || !('clipboard' in navigator)) return;

    clearTimeout(timeout);
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      timeout = setTimeout(() => {
        copied = false;
      }, 1250);
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
    <button
      on:click={copyTextToClipboard}
      class="sticky right-0 btn ml-1 text-xs pl-2 py-2 pr-2 rounded-tl-none rounded-bl-none min-w-[4.25rem]"
      class:btn-success={copied}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  {/if}
</div>
