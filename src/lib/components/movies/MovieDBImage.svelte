<script lang="ts">
  export let path: string;
  // Only certain sizes are allowed https://developers.themoviedb.org/3/configuration/get-api-configuration
  export let size: 342 | 500 = 342;

  const relativePath = path.startsWith('/') ? path.slice(1) : path;
</script>

<img src={`https://image.tmdb.org/t/p/w${size}/${relativePath}`} alt="" />
