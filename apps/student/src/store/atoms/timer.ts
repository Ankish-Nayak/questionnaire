import { atom } from "recoil";

export const timer = atom<{
  isLoading: boolean;
  show: boolean;
  startTime: number;
  endTime: number;
}>({
  key: "timer",
  default: {
    isLoading: true,
    show: false,
    startTime: 0,
    endTime: 0,
  },
});

export const timeOut = atom<NodeJS.Timeout | undefined>({
  key: "timeOut",
  default: undefined,
});

export const timeInterval = atom<NodeJS.Timer | undefined>({
  key: "timeInterval",
  default: undefined,
});
