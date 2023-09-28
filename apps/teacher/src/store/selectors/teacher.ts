import { selector } from "recoil";
import { teacherState } from "../atoms/teacher";

export const isTeacherLoading = selector({
  key: "isTeacherLoading",
  get: ({ get }) => {
    const state = get(teacherState);
    return state.isLoading;
  },
});

export const teacherEmailState = selector({
  key: "teacherEmailState",
  get: ({ get }) => {
    const state = get(teacherState);
    return state.userEmail;
  },
});
