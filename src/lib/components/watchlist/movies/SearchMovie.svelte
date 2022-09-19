<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ selected: unknown }>();

  let results: { id: string; title: string }[] = [
    {
      id: 'abc',
      title: 'Interstellar',
    },
    {
      id: 'def',
      title: 'The Shawshank Redemption',
    },
  ];
  let timer: NodeJS.Timer;

  const debounce = (v: typeof results[number]) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      console.log(v);
      // results = await fetch('/api/movies', {
      //   method: 'GET',
      // });
      dispatch(
        'selected',
        results.find((r) => r.name === v)
      );
    }, 250);
  };
</script>

<div class="form-control">
  <label for="movie">Search Movie</label>
  <select id="movie" on:change={(e) => !!e?.target && debounce(e.target)}>
    {#each results as result}
      <option id={result.id}>{result.title}</option>
    {/each}
  </select>
</div>
