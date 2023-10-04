export const toAnalog = (t: number) => {
  let minutes: number = Math.floor(t / 60);
  let seconds: number = Math.floor(t % 60);
  const leadingZero = (s: string) => {
    return s.length == 1 ? "0" + s : s;
  };
  return (
    leadingZero(minutes.toString()) + ":" + leadingZero(seconds.toString())
  );
};