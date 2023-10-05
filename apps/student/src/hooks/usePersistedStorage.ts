import { MutableSnapshot, useRecoilTransactionObserver_UNSTABLE } from "recoil";
import { questionCart } from "../store/atoms/questionCart";
import { timeInterval, timeOut, timer } from "../store/atoms/timer";
import { answers } from "../store/atoms/answers";
import { submit } from "../store/atoms/submit";
import { selectedOptionsStorageKeys } from "../store/atoms/selectedOptions";
import { testActive } from "../store/atoms/testActive";

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
  const persistedAnswers = await snapshot.getPromise(answers);
  const persistedSubmit = await snapshot.getPromise(submit);
  const persistedTimeOut = await snapshot.getPromise(timeOut);
  const persistedTimeInterval = await snapshot.getPromise(timeInterval);
  const persistedSelectedOptionsStorageKeys = await snapshot.getPromise(
    selectedOptionsStorageKeys
  );
  const persistedTestActive = await snapshot.getPromise(testActive);
  return {
    testQuestion: persistedQuestion,
    timer: persistedTimer,
    answers: persistedAnswers,
    submit: persistedSubmit,
    selectedOptionsStorageKeys: persistedSelectedOptionsStorageKeys,
    testActive: persistedTestActive,
    timeInterval: persistedTimeInterval,
    timeOut: persistedTimeOut,
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
  const {
    testQuestion: persistedQuestion,
    timer: persistedTimer,
    answers: persistedAnswers,
    submit: persistedSubmit,
    testActive: persistedTestActive,
    selectedOptionsStorageKeys: persistedSelectedOptionsStorageKeys,
    timeInterval: persistedTimeInterval,
    timeOut: persistedTimeOut,
  } = data;
  if (persistedQuestion && persistedQuestion.questions)
    set(questionCart, {
      isLoading: false,
      questions: persistedQuestion.questions.map((questionId: number) => {
        return questionId;
      }),
    });
  set(testActive, persistedTestActive);
  set(timeInterval, persistedTimeInterval);
  set(timeOut, persistedTimeOut);
  if (persistedTimer && persistedTimer.show)
    set(timer, {
      isLoading: false,
      show: persistedTimer.show,
      startTime: persistedTimer.startTime,
      endTime: persistedTimer.endTime,
    });
  // check for iterable introduced
  if (
    persistedAnswers &&
    typeof persistedAnswers[Symbol.iterator] === "function"
  ) {
    set(answers, new Map(persistedAnswers));
  }
  // if(selectedOptions)
  set(submit, persistedSubmit);
  if (
    persistedSelectedOptionsStorageKeys &&
    typeof persistedSelectedOptionsStorageKeys[Symbol.iterator] === "function"
  )
    set(selectedOptionsStorageKeys, [...persistedSelectedOptionsStorageKeys]);
};
