<script lang="ts">
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { getCircularly, shuffle } from '$lib/util/array';
  import { easeOutCirc } from '$lib/util/easing';
  import { range } from '$lib/util/range';
  import { wait } from '$lib/util/wait';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let items: string[] = [];
  export let shownOptionsCount = 7;

  let finished = false;
  let isRandomizing = false;

  let itemsToSelectFrom: string[] = items;
  let currentlySelectedIndex: number = 0;

  $: getRandomIndex = () => Math.floor(Math.random() * (items.length - 1 - 0 + 1) + 0);

  $: resetRandomValues = () => {
    itemsToSelectFrom = shuffle(items);
    currentlySelectedIndex = getRandomIndex();
  };

  onMount(() => {
    resetRandomValues();
  });

  $: randomize = async () => {
    if (isRandomizing) return;

    resetRandomValues();

    finished = false;
    isRandomizing = true;

    const finalIndex = currentlySelectedIndex;

    const iterations = 20;
    const easedIterationsCount = 10;
    const easedMultiplier = 300;
    const baseDelay = 100;

    // Set the selected index such that we can iterate towards the final index
    currentlySelectedIndex = finalIndex - (iterations + easedIterationsCount);

    // Iterate at a fixed speed
    for (let i = 0; i < iterations; i++) {
      !$reducedMotion && (await wait(baseDelay));
      currentlySelectedIndex++;
    }

    // Gradually slow down during the final few iterations
    for (let i = 0; i < easedIterationsCount; i++) {
      const eased = easeOutCirc(i, 0, 1, easedIterationsCount);
      !$reducedMotion && (await wait(baseDelay + eased * easedMultiplier));
      currentlySelectedIndex++;
    }

    isRandomizing = false;
    finished = true;
  };

  let shownItems: { value: string; selected: boolean }[];
  $: {
    const maxOptionsShown = Math.min(shownOptionsCount, items.length);
    shownItems = range(maxOptionsShown, -Math.floor(maxOptionsShown / 2)).map((offset) => ({
      value: getCircularly(itemsToSelectFrom, currentlySelectedIndex + offset),
      selected: offset === 0,
    }));
  }
</script>

{#if finished}
  <div class="h-full flex justify-center flex-col">
    <span
      in:fade
      class="text-center whitespace-pre break-words w-full drop-shadow-2xl transition-all py-8 px-6! bg-primary-focus rounded-md text-xl md:text-3xl text-primary-content"
    >
      {getCircularly(itemsToSelectFrom, currentlySelectedIndex)}
    </span>
  </div>
  <div class="flex justify-center mt-4">
    <button class="btn btn-primary btn-sm" disabled={isRandomizing} on:click={randomize}>Randomize</button>
  </div>
{:else}
  <div class="select-none w-full not-prose relative text-center" in:fade>
    <ul class="min-h-[14rem]">
      {#each shownItems as item (item.value)}
        {@const isSelectedItem = item.selected}
        <li
          transition:slide|local={{ duration: $reducedMotion ? 0 : 350 }}
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
    <button class="btn btn-primary btn-sm" disabled={isRandomizing} on:click={randomize}>Randomize</button>
  </div>
{/if}
