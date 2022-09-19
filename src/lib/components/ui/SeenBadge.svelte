<script lang="ts">
  export let seenOn: Date | null;
</script>

<div
  class={`badge min-w-[5rem] select-none ${seenOn ? 'badge-success' : 'badge-ghost'}`}
  title={seenOn?.toDateString()}
>
  {seenOn ? 'Seen' : 'Unseen'}
</div>
