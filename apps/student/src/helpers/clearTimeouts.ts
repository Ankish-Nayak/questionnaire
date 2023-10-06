export const clearTimeouts = (
  timeOuts: NodeJS.Timeout[]
): Promise<string>[] => {
  return timeOuts.map((id) => {
    return new Promise<string>((res) => {
      clearTimeout(id);
      res("Cleared Timeout: " + id);
    });
  });
  // return new Promise<string>((res) => {
  //   timeOuts.forEach((id) => {
  //     console.log("cleared timeout:", id);
  //     clearTimeout(id);
  //   });
  //   res("cleared Timeouts");
  // });
};
