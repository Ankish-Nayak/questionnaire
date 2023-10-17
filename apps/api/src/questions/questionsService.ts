import { questionTypes } from "types";
import { ApiError } from "../errors/ApiError";
import { prisma } from "../app";
import { Prisma, Question } from "@prisma/client";
import { questionParams } from "./question";
import { error } from "console";
import { Res, Response } from "tsoa";

// interface questionsI = questionParams & {id:number}
export class QuestionsService {
  public async create(
    questionParams: questionParams,
    creatorId: number
  ): Promise<Question> {
    const parsedInput = questionTypes.safeParse(questionParams);
    if (!parsedInput.success) {
      throw new ApiError(
        "question",
        411,
        JSON.stringify({ error: parsedInput.error })
      );
    }
    const data: questionParams = parsedInput.data;
    try {
      const question = await prisma.question.create({
        data: {
          ...data,
          creatorId,
        },
      });
      return question;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, JSON.stringify({ error: e }));
    }
  }
  public async getByQuestionId(questionId: number) {
    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });
      return question;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, JSON.stringify({ error: e }));
    }
  }
  public async getQuestionsByCreatorId(
    creatorId: number
  ): Promise<Question[] | undefined> {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { id: creatorId },
        include: {
          questions: true,
        },
      });
      return teacher?.questions;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, JSON.stringify({ error: e }));
    }
  }
  public async getAllQuestions(): Promise<Question[]> {
    try {
      const questions = await prisma.question.findMany({});
      return questions;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, JSON.stringify({ error: e }));
    }
  }
  public async update(
    questionParams: questionParams,
    questionId: number
  ): Promise<Question> {
    try {
      const updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: { ...questionParams },
      });
      return updatedQuestion;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, JSON.stringify({ error: e }));
    }
  }
}
