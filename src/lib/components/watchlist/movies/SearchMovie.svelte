<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import Select from 'svelte-select';
  import type { Writable } from 'svelte/store';

  export let resultsStore: Writable<unknown[]>;
  export let excludeResults: string[] = [];

  const dispatch = createEventDispatcher<{ select: MovieSearchResult }>();

  let selectedMovie: MovieSearchResult | null = null;

  resultsStore.subscribe((items) => {
    if (!items.length) {
      selectedMovie = null;
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
    resultsStore.set(filteredResults);

    return $resultsStore;
  };

  const handleSelect = (event: CustomEvent<MovieSearchResult>) => {
    selectedMovie = event.detail;
    dispatch('select', selectedMovie);
  };
</script>

<div class="form-control w-full themed">
  <label class="label" for="movie">Movie</label>
  <Select
    id="movie"
    loadOptions={searchMovies}
    items={$resultsStore}
    value={selectedMovie}
    on:select={handleSelect}
    on:clear={() => resultsStore.set([])}
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
