import { atom } from "recoil";

type question = {
  id: Number;
};
export const questionCart = atom<{
  isLoading: Boolean;
  questions: null | question[];
}>({
  key: "questionCart",
  default: {
    isLoading: true,
    questions: null,
  },
});
