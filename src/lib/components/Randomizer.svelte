<script lang="ts">
  import { range } from '$lib/util/range';
  import { wait } from '$lib/util/wait';
  import { fade, slide } from 'svelte/transition';

  export let items: string[] = [];
  export let shownOptionsCount = 7;

  let selectedIndex = Math.floor(Math.random() * (items.length - 1 - 0 + 1) + 0);
  let finished = false;
  let isRandomizing = false;

  $: n = items.length;
  $: linearStepThrough = async () => {
    if (isRandomizing) return;

    finished = false;
    isRandomizing = true;

    const getRandomIndex = (items: unknown[]) => Math.floor(Math.random() * (items.length - 1 - 0 + 1) + 0);
    const offset = getRandomIndex(items);

    const iterations = items.length * 3;

    for (let i = 0; i < iterations; i++) {
      selectedIndex = (((i + offset) % n) + n) % n;

      const minDelay = 25;
      const maxDelay = 1000;

      const dynamicDelay = (i / items.length) * 150;

      const delayInMs = Math.min(Math.max(minDelay, dynamicDelay), maxDelay);

      await wait(delayInMs);
    }

    isRandomizing = false;
    finished = true;
  };

  $: _maxOptionsShown = Math.min(shownOptionsCount, n);
  $: circularAccess = (index: number) => items[((index % n) + n) % n];

  $: shownItems = range(_maxOptionsShown, -Math.floor(_maxOptionsShown / 2)).map((offset) => ({
    value: circularAccess(selectedIndex + offset),
    selected: offset === 0,
  }));
</script>

{#if shownItems.length}
  {#if finished}
    <div class="h-full flex justify-center flex-col">
      <span
        in:fade
        class="text-center whitespace-pre break-words w-full drop-shadow-2xl transition-all py-8 px-6! bg-primary-focus rounded-md text-xl md:text-3xl text-primary-content"
      >
        {circularAccess(selectedIndex)}
      </span>
    </div>
    <div class="flex justify-center mt-4">
      <button class="btn btn-primary btn-sm" disabled={isRandomizing} on:click={linearStepThrough}>Randomize</button>
    </div>
  {:else}
    <div class="select-none w-full not-prose relative text-center" in:fade>
      <ul class="min-h-[14rem]">
        {#each shownItems as item (item.value)}
          {@const isSelectedItem = item.selected}
          <li
            transition:slide|local={{ duration: 350 }}
            class:font-bold={isSelectedItem}
            class:text-lg={isSelectedItem}
          >
            <span class="transition-all">
              {item.value}
            </span>
          </li>
        {/each}
      </ul>
    </div>
    <div class="flex justify-center mt-4">
      <button class="btn btn-primary btn-sm" disabled={isRandomizing} on:click={linearStepThrough}>Randomize</button>
    </div>
  {/if}
{/if}
