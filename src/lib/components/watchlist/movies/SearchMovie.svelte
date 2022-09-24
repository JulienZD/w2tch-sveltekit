<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { onMount } from 'svelte';
  import Select from 'svelte-select';
  import type { Writable } from 'svelte/store';

  export let movieSearchStore: Writable<{ results: MovieSearchResult[]; selection?: MovieSearchResult }>;
  export let excludeResults: string[] = [];
  export let autoFocusOnMount = false;

  let isFocused = false;
  onMount(() => {
    if (autoFocusOnMount) {
      setTimeout(() => {
        isFocused = true;
      }, 1);
    }
  });

  const defaultEmptyMessage = 'Start typing to search';
  let emptyMessage = defaultEmptyMessage;

  const searchMovies = async (filterText: string) => {
    emptyMessage = 'No results';

    const response = await fetch(`/api/movie/search?query=${filterText}`);
    if (!response.ok) {
      emptyMessage = 'An error occurred';
      return [];
    }

    const { movies } = await response.json();
    if (movies?.length) {
      emptyMessage = defaultEmptyMessage;
    }

    const filteredResults = movies.filter((m: { title: string }) => !excludeResults.includes(m.title));
    movieSearchStore.update((current) => ({
      ...current,
      results: filteredResults,
    }));

    return $movieSearchStore.results;
  };

  const handleSelect = (event: CustomEvent<MovieSearchResult>) => {
    movieSearchStore.update((current) => ({
      ...current,
      selection: event.detail,
    }));
  };
</script>

<div class="form-control w-full themed">
  <label class="label" for="movie">Movie</label>
  <Select
    bind:isFocused
    id="movie"
    loadOptions={searchMovies}
    items={$movieSearchStore.results}
    value={$movieSearchStore.selection}
    on:select={handleSelect}
    on:clear={() =>
      movieSearchStore.set({
        selection: undefined,
        results: [],
      })}
    placeholder="Type to search"
    noOptionsMessage={emptyMessage}
    labelIdentifier="title"
    optionIdentifier="id"
  />
</div>

<style lang="postcss">
  .themed {
    --border: 1px solid currentColor;
    --borderRadius: 4px;
    --background: transparent;
    --listBackground: theme(colors.base-100);
    --listEmptyColor: theme(colors.base-content);
    --placeholderColor: theme(colors.base-content);
    --inputColor: theme(colors.base-content);
    --itemColor: theme(colors.base-content);
    --itemIsActiveColor: theme(colors.primary-content);
    --itemIsActiveBG: theme(colors.primary);
    --itemHoverColor: theme(colors.neutral-focus);
    --itemHoverBG: theme(colors.base-300);
  }

  :global([data-theme='night']) .themed {
    --listBackground: theme(colors.neutral);
    --itemHoverColor: theme(colors.neutral-content);
    --itemHoverBG: theme(colors.neutral-focus);
  }
</style>
