import { atom } from "recoil";

export const answers = atom<Map<number, string> | null>({
  key: "answers",
  default: null,
});
