<script lang="ts">
  import { page } from '$app/stores';
  import { enhanceWithLoader } from '$lib/actions/enhanceWithLoader';
  import Pluralize from '$lib/components/Pluralize.svelte';
  import Seo from '$lib/components/SEO.svelte';
  import WatchlistInviteContent from '$lib/components/watchlist/WatchlistInviteContent.svelte';
  import { accountRequired } from '$lib/stores/accountRequired';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  const { invite, isExistingMember } = data;

  const isLoading = writable(false);

  $: isInviteAcceptSuccessful = form && 'success' in form && form.success;
  $: formError = form && 'error' in form && form.error;

  onMount(() => {
    accountRequired.set(!$page.data.user);
  });
</script>

{#if invite}
  <Seo
    title="Watchlist invite"
    description={`${invite.invitedBy} has invited you to join their watchlist:\n\n${invite.watchlist.name}`}
  />
{:else}
  <Seo title="Invite expired" description="This invitation seems to be expired or invalid." />
{/if}

{#if !invite}
  <WatchlistInviteContent title="Invite Not Found">
    <p class="mt-0 text-2xl">This invite code seems to be invalid or expired.</p>
    <div>
      <a href="/" class="link link-primary">Go back home</a>
    </div>
  </WatchlistInviteContent>
{:else if !isInviteAcceptSuccessful}
  <WatchlistInviteContent title="You have been invited!">
    <p class="mb-0">
      {invite.invitedBy} has invited you to join their watchlist
    </p>
    <span class="mt-2 text-xl text-center font-bold">{invite.watchlist.name}</span>

    <div class="flex gap-x-2 justify-center mt-2 mb-8">
      <Pluralize count={invite.watchlist.memberCount} word="Member" />
      -
      <Pluralize count={invite.watchlist.movieCount} word="Movie" />
    </div>
    {#if !isExistingMember}
      {#if formError}
        <span class="text-error">{formError}</span>
      {/if}
      <form method="POST" action="?/acceptInvite" use:enhanceWithLoader={isLoading}>
        <input type="hidden" name="code" value={invite.code} />
        <div class="flex justify-end">
          <button class="btn btn-primary btn-block md:btn-md" class:loading={$isLoading}>Accept Invite</button>
        </div>
      </form>
    {:else}
      <p class="text-center">You are already part of this watchlist.</p>
      <a href={`/watchlist/${invite.watchlist.id}`} class="btn btn-block btn-primary text-end">View Watchlist</a>
    {/if}
  </WatchlistInviteContent>
{:else}
  <WatchlistInviteContent title="Invite Accepted!">
    <p class="text-center">
      You are now part of
      <span class="font-bold">{invite.watchlist.name}</span>
    </p>

    <a href={`/watchlist/${invite.watchlist.id}`} class="btn btn-block btn-primary text-end">View Watchlist</a>
  </WatchlistInviteContent>
{/if}
