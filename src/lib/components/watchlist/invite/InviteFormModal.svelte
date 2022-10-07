<script lang="ts">
  import BasicModal from '$lib/components/ui/modal/BasicModal.svelte';
  import type { ComponentProps } from 'svelte';
  import { fade } from 'svelte/transition';
  import InviteForm from './InviteForm.svelte';

  type $$Props = ComponentProps<BasicModal>;

  let inviteLink: string;
</script>

<BasicModal {...$$restProps} buttons={false} on:resolve>
  <div slot="body" class="md:w-96">
    <InviteForm on:inviteLink={(e) => (inviteLink = e.detail)} disabled={!!inviteLink} />

    <p class="mb-0 text-sm font-bold">Invite link</p>
    <p class="mt-0 min-h-[2.75rem] p-2 rounded bg-base-300 overflow-x-scroll whitespace-nowrap">
      {#if inviteLink}
        <span in:fade={{ duration: 200 }}>{inviteLink}</span>
      {/if}
    </p>
  </div>
</BasicModal>
