import { atom } from "recoil";

export const submit = atom<boolean>({
  key: "submit",
  default: false,
});
