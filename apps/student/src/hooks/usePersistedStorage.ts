import { MutableSnapshot, useRecoilTransactionObserver_UNSTABLE } from "recoil";
import { questionCart } from "../store/atoms/questionCart";

// Serializing data in Recoil is an unstable feature, but it's still available in the published version. useRecoilTransactionObserver_UNSTABLE is a named export of the recoil package, and calls a function every time any Recoil state is changed.
export const usePersistStorage = () => {
  useRecoilTransactionObserver_UNSTABLE(async ({ snapshot }) => {
    processSnapshot(snapshot);
  });
};

// save when we wanted to
// export const saveState = useRecoilCallback(({ snapshot }) => () => {
//   processSnapshot(snapshot);
// });
// @ts-ignore
const processSnapshot = async (snapshot) => {
  const persistedQuestion = await snapshot.getPromise(questionCart);
  localStorage.setItem(
    "question_cart",
    JSON.stringify({
      testQuestions: persistedQuestion,
    })
  );
};
export const initState = (snapshot: MutableSnapshot) => {
  const data = localStorage.getItem("question_cart");
  if (!data) return;
  const { testQuestions: persistedQuestion } = JSON.parse(data);
  if (!persistedQuestion || !persistedQuestion.questions) return;
  snapshot.set(questionCart, {
    isLoading: false,
    questions: persistedQuestion.questions.map((questionId: Number) => {
      return questionId;
    }),
  });
};
