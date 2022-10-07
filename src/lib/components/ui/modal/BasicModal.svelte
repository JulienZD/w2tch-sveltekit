<script lang="ts">
  import Modal from '@svelte-put/modal/Modal.svelte';
  import { createModalEventDispatcher } from '@svelte-put/modal';
  import type { ExtendedModalProps, ExtendedModalEvents } from '@svelte-put/modal';
  import { beforeNavigate } from '$app/navigation';

  type $$Props = ExtendedModalProps<{
    disabled?: boolean;
    preventNavigation?: boolean;
    buttons?: boolean;
    cancelButton?: boolean;
    title?: string;
    bodyText?: string;
  }>;
  type $$Events = ExtendedModalEvents<{ confirmed: boolean }>;

  export let disabled: NonNullable<$$Props['disabled']> = false;
  export let preventNavigation: NonNullable<$$Props['preventNavigation']> = false;
  export let cancelButton: NonNullable<$$Props['cancelButton']> = false;
  export let buttons: NonNullable<$$Props['buttons']> = false;
  export let title: NonNullable<$$Props['title']>;
  export let bodyText: NonNullable<$$Props['bodyText']> = '';

  const dispatch = createModalEventDispatcher<$$Events>();

  beforeNavigate(({ cancel }) => {
    if (preventNavigation) {
      cancel();
    } else {
      // Close the modal on navigate
      dispatch('resolve', {
        trigger: 'pop',
      });
    }
  });

  const resolve = (confirmed: boolean) => {
    dispatch('resolve', {
      trigger: 'custom',
      confirmed,
    });
  };

  const confirm = () => {
    resolve(true);
  };

  const cancel = () => {
    resolve(false);
  };
</script>

<Modal
  classes={{
    x: 'absolute top-4 right-4',
    container: 'w-full px-2 md:mx-auto md:w-auto md:min-w-[20rem]',
  }}
  {...$$restProps}
  {dispatch}
>
  <div class="bg-base-100 p-4 rounded-md prose w-full">
    <h2 class="font-medium">{title}</h2>

    <slot name="body">
      <p>{bodyText}</p>
    </slot>

    {#if buttons}
      <div class="flex flex-row-reverse">
        <button class="btn-sm btn-primary rounded" type="button" on:click={confirm} {disabled}>Confirm</button>
        {#if cancelButton}
          <button class="btn-ghost btn-sm rounded" type="button" on:click={cancel} {disabled}>Cancel</button>
        {/if}
      </div>
    {/if}
  </div>
</Modal>
