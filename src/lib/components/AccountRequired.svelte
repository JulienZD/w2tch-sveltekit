<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { accountRequired } from '$lib/stores/accountRequired';

  $: showAccountRequired = $accountRequired && !$page.data.user;

  const createAccount = async () => {
    await fetch('/api/account/', {
      method: 'POST',
    });

    invalidateAll();
  };
</script>

{#if showAccountRequired}
  <div
    class="h-screen w-screen absolute z-20 bg-transparent backdrop-filter backdrop-blur-md grid place-content-center"
  >
    <div class="bg-base-100 min-h-[12rem] w-[32rem] rounded prose p-4">
      <h1 class="text-center">Account required</h1>
      <p>Hey there! You need an account to access this page.</p>
      <p>
        Already have one? <a
          href={`/login?returnUrl=${$page.url.pathname}`}
          on:click={() => accountRequired.set(false)}
          class="link link-primary">Login</a
        >
      </p>
      <p>
        <button on:click={createAccount} class="link-primary link">Get started</button>
        (no email required!)
      </p>
    </div>
  </div>
{/if}
