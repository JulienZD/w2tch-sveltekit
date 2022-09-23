<script lang="ts">
  import pluralize from 'pluralize';

  export let count: number;
  export let word: string;
</script>

<span>{count} {pluralize(word, count)}</span>
