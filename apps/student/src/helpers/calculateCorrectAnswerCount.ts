import { answerParams } from "types";

export const calculateCorrectAnswerCount = (
  map: Map<number, string>,
  selectedAnswers: answerParams[]
) => {
  return new Promise<number>((res, rej) => {
    try {
      let result: number = 0;
      const promises = selectedAnswers.map(({ questionId, answer }) => {
        result += map.get(questionId) === answer ? 1 : 0;
      });
      Promise.all(promises).then(() => {
        res(result);
      });
    } catch (e) {
      rej(e);
    }
  });
};
