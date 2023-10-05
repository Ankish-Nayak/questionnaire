import { atom } from "recoil";

export const testActive = atom<boolean>({
  key: "testActive",
  default: false,
});
