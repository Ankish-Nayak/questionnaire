import { RecoilState, atom } from "recoil";

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

export interface TestQuestionI {
  questionId: number;
  selectedOption: undefined | string;
  answer: undefined | string;
  correct: undefined | boolean;
}

const testQuestionFamilyCache: Record<number, RecoilState<TestQuestionI>> = {};
export const testQuestionFamily = (id: number) => {
  if (!testQuestionFamilyCache[id]) {
    testQuestionFamilyCache[id] = atom<TestQuestionI>({
      key: `testQuestion${id}`,
      default: {
        questionId: id,
        selectedOption: undefined,
        answer: undefined,
        correct: undefined,
      },
    });
  }
  return testQuestionFamilyCache[id];
};
