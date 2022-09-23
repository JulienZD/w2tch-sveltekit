<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  let email = '';
  let name = '';
  let password = '';

  let errors: Record<string, string> = {};

  const handleSignup = async () => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });
    if (!response.ok) {
      const { error } = await response.json();
      errors = error.fieldErrors;
      return;
    }

    goto('/?reload=1');
  };
</script>

<div class="container prose">
  <h1>Create account</h1>
  <p>
    This will convert your temporary account into a permanent one. Afterwards you can login using the email and password
    combination you provided.
  </p>
  <form on:submit|preventDefault={handleSignup}>
    <div class="form-control">
      <label for="name" class="label">Username</label>
      <input
        id="name"
        bind:value={name}
        required
        class:border-error={errors.name}
        class="input max-w-xs"
        placeholder={data?.user?.name ?? 'Marty McFly'}
      />
      {#if errors.name}
        <p class="my-0 text-error text-sm">{errors.name}</p>
      {/if}
    </div>
    <div class="form-control">
      <label for="email" class="label">Email</label>
      <input
        id="email"
        bind:value={email}
        type="email"
        required
        class:border-error={errors.email}
        class="input max-w-xs"
        placeholder="bruce@wayne.com"
      />
      {#if errors.email}
        <p class="my-0 text-error text-sm">{errors.email}</p>
      {/if}
    </div>
    <div class="form-control">
      <label for="password" class="label">Password</label>
      <input
        id="password"
        bind:value={password}
        type="password"
        required
        class:border-error={errors.password}
        class="input max-w-xs"
      />
      {#if errors.password}
        <p class="my-0 text-error text-sm">{errors.password}</p>
      {/if}
    </div>

    <button class="btn btn-primary mt-2">Create Account</button>
  </form>
</div>
