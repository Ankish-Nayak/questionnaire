import { atom } from "recoil";

export const questionCart = atom<{
  isLoading: boolean;
  questions: number[];
}>({
  key: "questionCart",
  default: {
    isLoading: true,
    questions: [],
  },
});
