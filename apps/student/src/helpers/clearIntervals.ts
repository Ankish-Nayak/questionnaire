export const clearIntervals = (
  timeIntervals: NodeJS.Timer[]
): Promise<string>[] => {
  return timeIntervals.map((id): Promise<string> => {
    return new Promise<string>((res) => {
      clearInterval(id);
      res("cleared interval: " + id);
    });
  });
};
