import { clearIntervals } from "./clearIntervals";
import { clearTimeouts } from "./clearTimeouts";
import { SetterOrUpdater } from "recoil";
export const clearIntervalsAndTimeOuts = (
  timeOuts: NodeJS.Timeout[],
  setTimeOuts: SetterOrUpdater<NodeJS.Timeout[]>,
  timeIntervals: NodeJS.Timer[],
  setTimeIntervals: SetterOrUpdater<NodeJS.Timer[]>
) => {
  Promise.all(clearTimeouts(timeOuts)).then((msgs) => console.log(msgs));
  Promise.all(clearIntervals(timeIntervals)).then((msgs) => console.log(msgs));
  setTimeOuts([]);
  setTimeIntervals([]);
};
