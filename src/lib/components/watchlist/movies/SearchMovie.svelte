<script lang="ts">
  import type { MovieSearchResult } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  import Select from 'svelte-select';

  export let hideResults: string[] = [];

  const dispatch = createEventDispatcher<{ select: MovieSearchResult }>();

  let selectedMovie: MovieSearchResult | null = null;

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

    return movies.filter((m: { title: string }) => !hideResults.includes(m.title));
  };

  const handleSelect = (event: CustomEvent<MovieSearchResult>) => {
    selectedMovie = event.detail;
    dispatch('select', selectedMovie);
  };
</script>

<div class="form-control w-full">
  <label class="label" for="movie">Movie</label>
  <Select
    id="movie"
    loadOptions={searchMovies}
    value={selectedMovie}
    on:select={handleSelect}
    placeholder="Type to search"
    noOptionsMessage={emptyMessage}
    labelIdentifier="title"
    optionIdentifier="id"
  />
</div>
