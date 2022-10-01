export const shuffle = <T = unknown>(array: T[]): T[] => {
  const copy = array.slice();

  let remaining = copy.length;

  while (remaining > 0) {
    const index = Math.floor(Math.random() * remaining);

    remaining--;

    const temp = copy[remaining];
    copy[remaining] = copy[index];
    copy[index] = temp;
  }

  return copy;
};

export const getCircularly = <T = unknown>(items: T[], index: number): T => {
  const n = items.length;
  return items[((index % n) + n) % n];
};
