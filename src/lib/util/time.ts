export const hoursToMs = (hours: number) => hours * 60 * 60 * 1000;

export const addMsToDate = (date: Date, ms: number) => {
  const added = new Date(date.getTime() + ms);

  return added;
};
