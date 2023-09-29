import { atom } from "recoil";

export const studentState = atom<{
  isLoading: Boolean;
  userEmail: String | null;
}>({
  key: "studentState",
  default: {
    isLoading: true,
    userEmail: null,
  },
});
