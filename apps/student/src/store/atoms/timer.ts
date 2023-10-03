import { atom } from "recoil";

export const timer = atom({
  key: "timer",
  default: {
    isLoading: true,
    show: false,
  },
});
