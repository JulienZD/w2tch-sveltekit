import { hoursToMs } from '$lib/util/time';
import humanizeDuration from 'humanize-duration';

interface ExpirationOption {
  label: string;
  hours: number;
}

export const expiryOptionsInHours = [1, 6, 24, 168];

export const expiryOptions: ExpirationOption[] = expiryOptionsInHours.map((hours) => ({
  hours,
  label: humanizeDuration(hoursToMs(hours), { largest: 1 }),
}));
