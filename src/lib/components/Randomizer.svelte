<script lang="ts">
  import { wait } from '$lib/util/wait';
  import { slide } from 'svelte/transition';

  export let items: string[] = [];

  let selectedIndex = -1;
  let finished = false;
  let isRandomizing = false;

  $: n = items.length;
  $: linearStepThrough = async () => {
    if (isRandomizing) return;

    finished = false;
    isRandomizing = true;

    const getRandomIndex = (items: unknown[]) => Math.floor(Math.random() * (items.length - 1 - 0 + 1) + 0);
    const offset = getRandomIndex(items);

    for (let i = 0; i < items.length * 3; i++) {
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

  $: circularAccess = (index: number) => items[((index % n) + n) % n];
  $: shownItems = [-1, 0, 1].map((offset) => ({
    value: circularAccess(selectedIndex + offset),
    selected: offset === 0,
  }));
</script>

<div class="select-none">
  <ul class="min-h-[6em]">
    {#each shownItems as item (item.value)}
      <li transition:slide|local={{ duration: 350 }} class:font-bold={item.selected} class:text-lg={item.selected}>
        <span
          class={`${
            item.selected && finished ? 'bg-success rounded-md px-2 py-0.5 ml-0.5 text-xl' : ''
          } transition-all`}
        >
          {item.value}
        </span>
      </li>
    {/each}
  </ul>

  <button class="btn btn-primary btn-sm" disabled={isRandomizing} on:click={linearStepThrough}>Randomize</button>
</div>
