<script lang="ts">
  import { StarIcon } from 'svelte-feather-icons';

  export let score: number;
</script>

<span class="flex items-center gap-x-1">
  <StarIcon class="fill-current" size="15" />{score}
</span>
