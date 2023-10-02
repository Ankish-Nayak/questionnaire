import { atom } from "recoil";

export const studentState = atom<{
  isLoading: boolean;
  userEmail: string | null;
}>({
  key: "studentState",
  default: {
    isLoading: true,
    userEmail: null,
  },
});
