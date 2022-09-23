<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';

  let error = false;

  const handleLogin = async () => {
    error = false;
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!response.ok) {
      error = true;
      return;
    }

    goto('/?reload=1');
  };
</script>

<div class="h-full grid place-content-center">
  <div class="p-10 shadow-md rounded-3xl bg-base-200 prose">
    <h1 class="text-center font-light">Login</h1>
    {#if error}
      <p class="my-0 text-error text-sm">Invalid credentials</p>
    {/if}
    <form on:submit|preventDefault={handleLogin}>
      <div class="form-control">
        <label for="email" class="label">Email</label>
        <input
          id="email"
          bind:value={email}
          type="email"
          required
          class="input max-w-xs"
          placeholder="bruce@wayne.com"
        />
      </div>
      <div class="form-control">
        <label for="password" class="label">Password</label>
        <input id="password" bind:value={password} type="password" required class="input max-w-xs" />
      </div>

      <button class="btn btn-primary mt-6 md:mt-4 w-full md:w-auto md:min-w-[6rem]">Login</button>
    </form>
  </div>
</div>
