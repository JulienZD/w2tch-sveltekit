<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="grid place-content-center h-screen">
  <h1 class="text-center text-5xl mb-4">Welcome</h1>

  <p class="font-bold">User info:</p>
  <pre>{JSON.stringify(data.user, undefined, 2)}</pre>
</div>
