import { atom } from "recoil";

export const teacherState = atom<{
  isLoading: Boolean;
  userEmail: String | null;
}>({
  key: "teacherState",
  default: {
    isLoading: true,
    userEmail: null,
  },
});
