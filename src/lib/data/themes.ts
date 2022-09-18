interface Theme {
  name: string;
  id: string;
}

// Keep in sync with `daisyui.theme` in Tailwind's config
export const themes: Theme[] = [
  {
    name: 'Dark',
    id: 'night',
  },
  {
    name: 'Light',
    id: 'winter',
  },
];
