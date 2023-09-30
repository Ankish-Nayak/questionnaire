import { selector } from "recoil";
import { questionCart } from "../atoms/questionCart";

export const isQuestionCartLoading = selector({
  key: "isQuestionCartLoading",
  get: ({ get }) => {
    const state = get(questionCart);
    return state.isLoading;
  },
});

export const questionCartArray = selector({
  key: "questionCartArray",
  get: ({ get }) => {
    const state = get(questionCart);
    return state.questions;
  },
});
