import { useRecoilCallback } from "recoil";
import { testQuestionFamily } from "../atoms/questionCart";

export const useUpdateItems = () => {
  return useRecoilCallback(
    ({ set, snapshot: { getPromise } }) =>
      async (
        newAnswers: Map<number, string>,
        // res: PromiseLike<Map<number, string>> => void
        res: (
          value: Map<number, string> | PromiseLike<Map<number, string>>
        ) => void
      ) => {
        const keys = newAnswers.keys();
        const promises = Array.from(keys).map(async (questionId) => {
          return new Promise<number>(async (res1) => {
            const testQuestion = await getPromise(
              testQuestionFamily(questionId)
            );
            set(testQuestionFamily(questionId), {
              // ...(await getPromise(testQuestionFamily(questionId))),
              questionId: testQuestion.questionId,
              selectedOption: testQuestion.selectedOption,
              answer: newAnswers.get(questionId),
              correct:
                testQuestion.selectedOption === newAnswers.get(questionId),
            });
            res1(questionId);
          });
        });
        Promise.all(promises).then((msgs) => {
          console.log(msgs);
          res(newAnswers);
        });
      },
    []
  );
};

export const useLoadItems = () => {
  return useRecoilCallback(
    ({ snapshot: { getPromise } }) =>
      async (testQuestions: number[]) => {
        return await Promise.all(
          testQuestions.map((questionId) => {
            return new Promise(async (res) => {
              const testQuestion = await getPromise(
                testQuestionFamily(questionId)
              );
              res({
                questionId: testQuestion.questionId,
                answer: testQuestion.selectedOption || "",
              });
            });
          })
        );
      }
  );
};

export const useResetItems = () => {
  return useRecoilCallback(
    ({ set }) =>
      async (testQuestions: number[]) => {
        testQuestions.forEach((questionId) => {
          set(testQuestionFamily(questionId), {
            questionId: questionId,
            selectedOption: undefined,
            answer: undefined,
            correct: undefined,
          });
        });
      },
    []
  );
};
