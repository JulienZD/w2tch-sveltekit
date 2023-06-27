/**
 * Automatically selects all the content inside the element when it is clicked
 *
 * Thanks to Tim Down for the selection logic: https://stackoverflow.com/a/6150060/16573484
 */
export const selectContent = (node: HTMLElement) => {
  const selectAllTextContent = () => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  node.addEventListener('click', selectAllTextContent);

  return {
    destroy: () => {
      node.removeEventListener('click', selectAllTextContent);
    },
  };
};
