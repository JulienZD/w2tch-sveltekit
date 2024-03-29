// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    user?: import('@prisma/client').User;
    temporaryAccountExpiresOn?: Date;
  }
  // interface PageData {}
  // interface PageError {}
  // interface Platform {}
}

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onclickoutside: () => void;
  }
}
