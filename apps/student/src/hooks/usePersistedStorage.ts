import {
  MutableSnapshot,
  snapshot_UNSTABLE,
  useRecoilTransactionObserver_UNSTABLE,
} from "recoil";
import { questionCart } from "../store/atoms/questionCart";
import { timer } from "../store/atoms/timer";

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
const generateData = async (snapshot) => {
  const persistedQuestion = await snapshot.getPromise(questionCart);
  const persistedTimer = await snapshot.getPromise(timer);
  return {
    testQuestion: persistedQuestion,
    timer: persistedTimer,
  };
};
const processSnapshot = async (snapshot: any) => {
  const data = await generateData(snapshot);
  localStorage.setItem("questionnaire", JSON.stringify(data));
};
export const initState = (snapshot: MutableSnapshot) => {
  const data = localStorage.getItem("questionnaire");
  if (!data) {
    return;
  }
  const outputData = JSON.parse(data);
  setData(outputData, snapshot.set);
};

export const setData = (data: any, set: MutableSnapshot["set"]) => {
  const { testQuestion: persistedQuestion, timer: persistedTimer } = data;
  if (persistedQuestion && persistedQuestion.questions)
    set(questionCart, {
      isLoading: false,
      questions: persistedQuestion.questions.map((questionId: number) => {
        return questionId;
      }),
    });
  if (persistedTimer && persistedTimer.show)
    set(timer, {
      isLoading: false,
      show: persistedTimer.show,
      startTime: persistedTimer.startTime,
      endTime: persistedTimer.endTime,
    });
};
