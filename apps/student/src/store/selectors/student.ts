import { selector } from "recoil";
import { studentState } from "../atoms/student";

export const studentEmailState = selector({
  key: "studentEmailState",
  get: ({ get }) => {
    const state = get(studentState);
    return state.userEmail;
  },
});

export const isStudentLoading = selector({
  key: "isStudentLoading",
  get: ({ get }) => {
    const state = get(studentState);
    return state.isLoading;
  },
});
