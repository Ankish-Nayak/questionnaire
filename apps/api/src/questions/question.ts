export type questionParams = {
  title: string;
  description: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
};
export interface Question {
  id: number;
  createdAt: Date;
  title: string;
  description: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  creatorId: number;
}
