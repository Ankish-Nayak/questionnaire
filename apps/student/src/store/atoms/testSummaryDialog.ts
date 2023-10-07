import { atom } from "recoil";

export const testSummaryDialog = atom<{
  show: boolean;
  correctAnswersCount: number | undefined;
}>({
  key: "testCompleteDialog",
  default: {
    show: false,
    correctAnswersCount: undefined,
  },
});
