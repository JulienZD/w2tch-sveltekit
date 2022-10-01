export const easeOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

export const easeInQuad = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return c * t * t + b;
};

export const easeOutCubic = (t: number, b: number, c: number, d: number) => {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
};

export const easeInCubic = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return c * t * t * t + b;
};

export const easeOutCirc = (t: number, b: number, c: number, d: number) => {
  t /= d;
  t--;
  return c * Math.sqrt(1 - t * t) + b;
};
