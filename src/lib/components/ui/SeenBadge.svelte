<script lang="ts">
  export let seenOn: string | null;
</script>

<div
  class={`badge min-w-[5rem] select-none ${seenOn ? 'badge-success' : 'badge-ghost'}`}
  title={seenOn ? new Date(seenOn).toDateString() : ''}
>
  {seenOn ? 'Seen' : 'Unseen'}
</div>
