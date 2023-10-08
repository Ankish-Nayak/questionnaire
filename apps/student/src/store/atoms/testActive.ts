import { atom } from "recoil";

export const testActive = atom<"starts" | "running" | "ended" | "undefined">({
  key: "testActive",
  default: undefined,
});
