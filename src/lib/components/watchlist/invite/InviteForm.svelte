<script lang="ts">
  import { reducedMotion } from '$lib/stores/reducedMotion';
  import { watchlistStore } from '$lib/stores/watchlistStore';
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  export let disabled = false;

  const dispatch = createEventDispatcher<{ inviteLink: string }>();

  $: transition = $reducedMotion ? fade : slide;

  let expiresInNDays = 7;
  let maxUsages = 5;
  let hasUnlimitedUses = true;

  let isSubmitting = false;
  let error = '';

  const submitInvite = async () => {
    if (isSubmitting || disabled) return;
    isSubmitting = true;

    const response = await fetch(`/api/invite`, {
      method: 'POST',
      body: JSON.stringify({
        expiresInNDays,
        maxUsages: hasUnlimitedUses ? -1 : maxUsages,
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

  <div>
    <p class="mb-0 label-text font-semibold">Amount of uses</p>
    <label class="inline-flex flex-row-reverse cursor-pointer label justify-start gap-x-2" for="hasUnlimitedUses">
      <span class="label-text">Unlimited</span>
      <input
        {disabled}
        class="checkbox checkbox-primary"
        type="checkbox"
        bind:checked={hasUnlimitedUses}
        id="hasUnlimitedUses"
        name="hasUnlimitedUses"
      />
    </label>
  </div>

  {#if !hasUnlimitedUses}
    <div transition:transition|local class="form-control my-2">
      <label class="label-text" for="maxUsages">Maximum</label>
      <input {disabled} class="input" min="1" type="number" bind:value={maxUsages} id="maxUsages" name="maxUsages" />
    </div>
  {/if}

  <button
    class="mt-2 btn btn-primary btn-sm rounded btn-block sm:w-auto"
    class:disabled
    {disabled}
    class:loading={isSubmitting}>Submit</button
  >
</form>
