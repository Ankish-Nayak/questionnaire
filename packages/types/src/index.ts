import { z } from "zod";
export const teacherSignupTypes = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().email(),
  password: z.string().min(8),
});
export const studentSignupTypes = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().email(),
  password: z.string().min(8),
});
export const studentLoginTypes = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});
export const teacherLoginTypes = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});
export const questionTypes = z.object({
  title: z.string().min(1),
  description: z.string().max(100),
  question: z.string().min(1),
  option1: z.string().min(1),
  option2: z.string().min(1),
  option3: z.string().min(1),
  option4: z.string().min(1),
  answer: z.string().min(1),
});
export const answerTypes = z.object({
  questionId: z.number().min(1),
  answer: z.string().min(1),
});
export const answersTypes = z.array(answerTypes);

export type questionParams = z.infer<typeof questionTypes>;
export type studentSignupParams = z.infer<typeof studentSignupTypes>;
export type teacherSignupParams = z.infer<typeof teacherSignupTypes>;
export type studentLoginParams = z.infer<typeof studentLoginTypes>;
export type teacherLoginParams = z.infer<typeof teacherLoginTypes>;
export type answerParams = z.infer<typeof answerTypes>;
