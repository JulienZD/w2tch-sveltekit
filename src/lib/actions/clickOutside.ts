/** Dispatch event on click outside of node or Escape keypress */
export const clickOutside = (node: HTMLElement) => {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (node && event.code === 'Escape') {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  };

  document.addEventListener('click', handleClick, true);
  document.addEventListener('keydown', handleKeyDown, true);

  return {
    destroy: () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    },
  };
};
