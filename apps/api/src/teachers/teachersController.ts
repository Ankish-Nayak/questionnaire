import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Queries,
  Query,
  Request,
  Response,
  Route,
} from "tsoa";
import {
  teacherLoginParams,
  teacherProfileParams,
  teacherSignupParams,
  CustomTeacherRequest,
} from "./teacher";
import { TeachersService } from "./teachersService";
import { ApiError } from "../errors/ApiError";
import { Question, Teacher } from "@prisma/client";
import { generateToken } from "../utils/generateToken";
import { QuestionsService } from "../questions/questionsService";
import { questionParams } from "../questions/question";
import { Middlewares } from "tsoa";
import { authenticateTeacherJwt } from "../middleware/auth";
import { Request as ExRequest, Response as ExResponse } from "express";
import { profileParams } from "../students/student";

@Route("teachers")
export class TeachersController extends Controller {
  private teachersService;
  private questionsService;
  constructor() {
    super();
    this.teachersService = new TeachersService();
    this.questionsService = new QuestionsService();
  }
  @Post("signup")
  public async signup(
    @Body() teacherSignParams: teacherSignupParams
  ): Promise<{ firstname: string }> {
    const existingTeacher = await this.teachersService.getByUsername(
      teacherSignParams.username
    );
    if (existingTeacher) {
      throw new ApiError("teacher", 403, "teacher already exists");
    }
    const teacher = await this.teachersService.create(teacherSignParams);
    const token = generateToken(teacher.id, "teacher");
    this.setHeader("Set-Cookie", `teacher-token=${token}; HttpOnly`);
    return { firstname: teacher.firstname };
  }
  @Post("login")
  public async login(
    @Body() teacherLoginParams: teacherLoginParams
  ): Promise<{ firstname: string }> {
    const teacher = await this.teachersService.authenticate(teacherLoginParams);
    if (!teacher) {
      throw new ApiError("teacher", 403, "teacher dose not exists");
    }
    const token = generateToken(teacher.id, "teacher");
    this.setHeader("Set-Cookie", `teacher-token=${token}; HttpOnly`);
    return { firstname: teacher.firstname };
  }
  @Middlewares(authenticateTeacherJwt)
  @Get("me")
  public async getFirstname(@Request() req: CustomTeacherRequest) {
    const { teacherId } = req.headers;
    const teacher = await this.teachersService.getById(
      req.headers["teacherId"]
    );
    if (teacher) {
      return { firstname: teacher.firstname };
    }
    throw new ApiError("teacher", 403, "teacher dose not exists");
  }
  @Get("profile")
  @Middlewares(authenticateTeacherJwt)
  public async getProfile(
    @Request() req: CustomTeacherRequest
  ): Promise<profileParams> {
    const { teacherId } = req.headers;
    const teacher = await this.teachersService.getById(teacherId);
    if (teacher) {
      const { firstname, lastname, username } = teacher;
      return { firstname, lastname, username };
    }
    throw new ApiError("teacher", 403, "teacher dose not exists");
  }
  @Put("profile")
  @Middlewares(authenticateTeacherJwt)
  public async updateProfile(
    @Request() req: CustomTeacherRequest,
    @Body() teacherProfilParams: teacherProfileParams
  ): Promise<profileParams> {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.getByUsername(
      teacherProfilParams.username
    );
    if (
      !existingTeacher ||
      (existingTeacher && existingTeacher.id === teacherId)
    ) {
      const updatedTeacher = await this.teachersService.update(
        teacherProfilParams,
        teacherId
      );
      const { firstname, lastname, username } = updatedTeacher;
      return { firstname, lastname, username };
    } else {
      // if (existingTeacher && existingTeacher.id !== teacherId)
      throw new ApiError("teacher", 400, "username taken");
    }
  }
  @Response(200, "teacher logged out")
  @Middlewares(authenticateTeacherJwt)
  @Post("logout")
  public async logout(@Request() req: ExRequest) {
    this.setHeader("Set-Cookie", undefined);
  }
  @Get("questions")
  @Middlewares(authenticateTeacherJwt)
  public async getAllQuestions(): Promise<Question[]> {
    return await this.questionsService.getAllQuestions();
  }
  //   @Route("{:teacherId}")
  @Get("{:teacherId}/questions")
  public async getAllQuestionsParticularTeacher(
    @Query("teacherId") teacherId: number
  ): Promise<{ questions: Omit<questionParams, "answer">[] }> {
    const questions =
      await this.questionsService.getQuestionsByCreatorId(teacherId);
    if (questions) {
      const newQuestions = questions.map((question) => {
        const { answer: _, ...newQuestion } = question;
        return newQuestion;
      });
      return { questions: newQuestions };
    }
    throw new ApiError("teacher", 403, "teacher dose not exists");
  }
  //   @Route("questions")
  @Get("questions/me")
  @Middlewares(authenticateTeacherJwt)
  public async getAllQuestionsMe(
    @Request() req: CustomTeacherRequest
  ): Promise<{ questions: Question[] }> {
    const { teacherId } = req.headers;
    const questions =
      await this.questionsService.getQuestionsByCreatorId(teacherId);
    if (questions) {
      return { questions: questions };
    }
    throw new ApiError("teacher", 403, "teacher dose not exists");
  }
  @Post("questions")
  @Middlewares(authenticateTeacherJwt)
  public async createQuestion(
    @Request() req: CustomTeacherRequest,
    @Body() questionParams: questionParams
  ) {
    const { teacherId } = req.headers;
    return await this.questionsService.create(questionParams, teacherId);
  }
  //   @Route("questions")
  @Post("questions/{questionId}")
  @Middlewares(authenticateTeacherJwt)
  public async updateQuestion(
    @Path("questionId") questionId: number,
    @Body() questionParams: questionParams,
    @Request() req: CustomTeacherRequest
  ): Promise<{ message: string; questionId: number }> {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.getById(teacherId);
    const existingQuestion =
      await this.questionsService.getByQuestionId(questionId);
    if (
      existingQuestion &&
      existingTeacher &&
      existingQuestion.creatorId === existingTeacher.id
    ) {
      await this.questionsService.update(questionParams, questionId);
      return { message: "updated successfully", questionId };
    } else if (
      existingQuestion &&
      existingTeacher &&
      existingQuestion.creatorId !== existingTeacher.id
    ) {
      throw new ApiError("teacher", 400, "teacher not authorized to update");
    } else {
      if (!existingQuestion) {
        throw new ApiError("teacher", 403, "question dose not exists");
      } else {
        throw new ApiError("teacher", 403, "teacher dose not exists");
      }
    }
  }
}
