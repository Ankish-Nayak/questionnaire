import { atom } from "recoil";

export const questionCart = atom<{
  isLoading: Boolean;
  questions: Number[];
}>({
  key: "questionCart",
  default: {
    isLoading: true,
    questions: [],
  },
});
