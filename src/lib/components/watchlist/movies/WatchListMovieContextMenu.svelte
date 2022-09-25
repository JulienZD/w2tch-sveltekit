<script lang="ts">
  import Menu from '$lib/components/ui/menu/Menu.svelte';
  import MenuItem from '$lib/components/ui/menu/MenuItem.svelte';
  import type { WatchlistMovie } from '$lib/models';
  import { watchlistStore } from '$lib/stores/watchlistStore';
  import { EyeIcon, EyeOffIcon, Trash2Icon } from 'svelte-feather-icons';

  export let movie: WatchlistMovie;
  export let variant: 'horizontal' | 'vertical' | 'inline' = 'vertical';

  const handleDeleteMovie = async () => {
    const result = await watchlistStore.removeMovie(movie.id);
    if (!result.success) {
      // TODO: Show error
      console.error(result.error);
    }
  };

  const handleUpdateMarkMovieSeenStatus = async () => {
    const result = await watchlistStore.updateMovie(movie.id, { seenOn: !movie.seenOn });
    if (!result.success) {
      // TODO: Show error
      console.error(result.error);
    }
    console.log('update', movie.id, 'to seen:', !!!movie.seenOn);
  };

  const markAsSeenUnseenText = `Mark as ${movie.seenOn ? 'Unseen' : 'Seen'}`;
  const markAsSeenUnseenA11yText = `Mark ${movie.name} as ${movie.seenOn ? 'unseen' : 'seen'}`;
</script>

{#if variant === 'inline'}
  <div class="flex items-center gap-x-4 float-right">
    <div class="tooltip" data-tip={markAsSeenUnseenText}>
      <button
        class="btn btn-ghost btn-sm rounded-box"
        aria-label={markAsSeenUnseenA11yText}
        on:click={handleUpdateMarkMovieSeenStatus}
      >
        {#if movie.seenOn}
          <EyeOffIcon size="20" />
        {:else}
          <EyeIcon size="20" />
        {/if}
      </button>
    </div>

    <Menu variant="vertical">
      <MenuItem label="Delete" on:click={handleDeleteMovie}>
        <Trash2Icon slot="icon" class="w-4 h-4" />
      </MenuItem>
    </Menu>
  </div>
{:else}
  <Menu {variant}>
    <MenuItem label={markAsSeenUnseenText} on:click={handleUpdateMarkMovieSeenStatus}>
      <svelte:fragment slot="icon">
        {#if movie.seenOn}
          <EyeOffIcon class="h-4 w-4" />
        {:else}
          <EyeIcon class="h-4 w-4" />
        {/if}
      </svelte:fragment>
    </MenuItem>
    <MenuItem label="Delete" on:click={handleDeleteMovie}>
      <Trash2Icon slot="icon" class="w-4 h-4" />
    </MenuItem>
  </Menu>
{/if}
