import { atom } from "recoil";

export const testSummaryDialog = atom<{
  show: boolean;
  correctAnswersCount: number | undefined;
}>({
  key: "testSummaryDialog",
  default: {
    show: false,
    correctAnswersCount: undefined,
  },
});
