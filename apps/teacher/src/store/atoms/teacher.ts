import { atom } from "recoil";

export const teacherState = atom<{
  isLoading: boolean;
  userEmail: string | null;
}>({
  key: "teacherState",
  default: {
    isLoading: true,
    userEmail: null,
  },
});
