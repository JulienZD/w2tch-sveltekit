<script lang="ts">
  import { AlertTriangleIcon } from 'svelte-feather-icons';
  import humanizeDuration from 'humanize-duration';

  export let temporaryAccountExpiresOn: Date;

  const timeDiff = temporaryAccountExpiresOn.getTime() - new Date().getTime();

  const timeUntilTemporaryAccountExpires = humanizeDuration(timeDiff, {
    round: true,
    units: ['w', 'd', 'h', 'm'],
    largest: 2,
    conjunction: ' and ',
  });
</script>

<div class="alert alert-warning shadow-lg">
  <div>
    <AlertTriangleIcon />
    <div class="flex flex-col items-start">
      <div>
        <span class="font-semibold">Heads up!</span> You're using a temporary account. There are {timeUntilTemporaryAccountExpires}
        left until you lose access.
      </div>
      <div>
        <a class="link-primary" href="/signup">Create an account</a>
        <span>to prevent losing access to your data.</span>
      </div>
    </div>
  </div>
</div>
