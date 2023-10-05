import { atom } from "recoil";
export const selectedOptionsStorageKeys = atom<string[]>({
  key: "selectedOptionsStorageKeys",
  default: [],
});
