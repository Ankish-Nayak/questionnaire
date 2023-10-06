import { atom } from "recoil";

export const timer = atom<{
  isLoading: boolean;
  show: boolean;
  startTime: number;
  endTime: number;
  submitTime: number;
}>({
  key: "timer",
  default: {
    isLoading: true,
    show: false,
    startTime: 0,
    endTime: 0,
    submitTime: 0,
  },
});

export const timeOuts = atom<NodeJS.Timeout[]>({
  key: "timeOut",
  default: [],
});

export const timeIntervals = atom<NodeJS.Timer[]>({
  key: "timeInterval",
  default: [],
});
