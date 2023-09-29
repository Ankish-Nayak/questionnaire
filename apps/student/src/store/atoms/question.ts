import { atom } from "recoil";
type questionType = {
  id: number;
  title: string;
  description: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
};
export const questionState = atom<{
  isLoading: Boolean;
  question: questionType | null;
}>({
  key: "questionState",
  default: {
    isLoading: true,
    question: null,
  },
});
