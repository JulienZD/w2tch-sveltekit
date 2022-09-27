<script lang="ts">
  import { ClockIcon } from 'svelte-feather-icons';
  import humanizeDuration from 'humanize-duration';

  export let temporaryAccountExpiresOn: Date;

  const timeDiff = temporaryAccountExpiresOn.getTime() - new Date().getTime();

  const timeUntilTemporaryAccountExpires = humanizeDuration(timeDiff, {
    round: true,
    units: ['w', 'd', 'h', 'm'],
    largest: 1,
    conjunction: ' and ',
  });

  const shortTimeUntilTemporaryAccountExpires = humanizeDuration(timeDiff, {
    round: true,
    units: ['w', 'd', 'h', 'm'],
    largest: 1,
  });
</script>

<div>
  <div class="hidden md:block alert alert-warning shadow-lg">
    <div>
      <ClockIcon />
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
  <div class="md:hidden alert alert-warning shadow-lg mx-auto max-w-xs">
    <div class="flex justify-between w-full">
      <div class="flex items-center gap-x-1.5">
        <ClockIcon size="16" />
        <div><span class="font-semibold">{shortTimeUntilTemporaryAccountExpires}</span> remaining</div>
      </div>
      <a class="link-primary" href="/signup">Sign up</a>
    </div>
  </div>
</div>
