<script lang="ts">
  import { watchlistStore } from '$lib/stores/watchlistStore';
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;

  const dispatch = createEventDispatcher<{ inviteLink: string }>();

  let expiresInNDays = 7;
  let maxUsages = -1;

  let isSubmitting = false;
  let error = '';

  const submitInvite = async () => {
    if (isSubmitting || disabled) return;
    isSubmitting = true;

    const response = await fetch(`/api/invite`, {
      method: 'POST',
      body: JSON.stringify({
        expiresInNDays,
        maxUsages,
        watchlistId: $watchlistStore.id,
      }),
    });

    if (!response.ok) {
      const responseError = (await response.json()).error;
      error = typeof responseError === 'string' ? responseError : 'An unknown error occurred';
      isSubmitting = false;
      return;
    }

    try {
      const data = await response.json();
      if (data.inviteLink) {
        dispatch('inviteLink', data.inviteLink);
      }
    } catch (error) {
      error = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form on:submit|preventDefault={submitInvite}>
  {#if error}
    <span class="text-error">{error}</span>
  {/if}

  <div class="form-control my-2">
    <label class="label-text" for="validForNDays">Expires in (days)</label>
    <input {disabled} class="input" type="number" bind:value={expiresInNDays} id="validForNDays" name="validForNDays" />
  </div>

  <div class="form-control my-2">
    <label class="label-text" for="maxUses">Max usages</label>
    <input {disabled} class="input" type="number" bind:value={maxUsages} id="maxUses" name="maxUses" />
  </div>

  <button
    class="btn btn-primary btn-sm rounded btn-block sm:w-auto"
    class:disabled
    {disabled}
    class:loading={isSubmitting}>Submit</button
  >
</form>
