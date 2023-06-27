<script lang="ts">
  import CopyText from '$lib/components/ui/CopyText.svelte';
  import BasicModal from '$lib/components/ui/modal/BasicModal.svelte';
  import type { ComponentProps } from 'svelte';
  import InviteForm from './InviteForm.svelte';

  type $$Props = ComponentProps<BasicModal>;

  let inviteLink: string;
</script>

<BasicModal {...$$restProps} buttons={false} on:resolve>
  <div slot="body" class="md:w-96">
    <InviteForm on:inviteLink={(e) => (inviteLink = e.detail)} disabled={!!inviteLink} />

    <p class="mb-0 text-sm font-bold">Invite link</p>
    <CopyText text={inviteLink} />
  </div>
</BasicModal>
