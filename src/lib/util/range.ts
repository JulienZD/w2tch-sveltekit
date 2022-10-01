/**
 * Creates a range of numbers of {size}
 * optionally takes a starting index
 */
export const range = (size: number, startAt = 0) => Array.from({ length: size }).map((_, i) => i + startAt);
