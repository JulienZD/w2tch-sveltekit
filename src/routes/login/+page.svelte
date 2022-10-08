<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  let email = '';
  let password = '';

  let error = false;

  $: returnUrl = $page.url.searchParams.get('returnUrl');
</script>

<div class="h-full grid place-content-center">
  <div class="p-10 shadow-md rounded-3xl bg-base-200 prose">
    <h1 class="text-center font-light">Login</h1>
    {#if error}
      <p class="my-0 text-error text-sm">Invalid credentials</p>
    {/if}
    <form method="POST" use:enhance>
      <div class="form-control">
        <label for="email" class="label">Email</label>
        <input
          id="email"
          name="email"
          bind:value={email}
          type="email"
          required
          class="input max-w-xs"
          placeholder="bruce@wayne.com"
        />
      </div>
      <div class="form-control">
        <label for="password" class="label">Password</label>
        <input id="password" bind:value={password} type="password" name="password" required class="input max-w-xs" />
      </div>

      <input type="hidden" name="returnUrl" value={returnUrl} />

      <button class="btn btn-primary mt-6 md:mt-4 w-full md:w-auto md:min-w-[6rem]">Login</button>
    </form>
  </div>
</div>
