<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';
  import { MoonIcon, SunIcon } from 'svelte-feather-icons';
  const theme = browser && localStorage.getItem('theme');

  onMount(() => {
    themeChange(false);
  });
</script>

<label class="swap swap-rotate">
  <input type="checkbox" data-toggle-theme="night,winter" data-act-class="ACTIVECLASS" checked={theme === 'winter'} />
  <SunIcon class="swap-on" size="28" />
  <MoonIcon class="swap-off" size="28" />
</label>
