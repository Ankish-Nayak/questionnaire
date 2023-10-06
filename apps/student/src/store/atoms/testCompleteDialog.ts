import { atom } from "recoil";

export const testCompleteDialog = atom<boolean>({
  key: "testCompleteDialog",
  default: false,
});
