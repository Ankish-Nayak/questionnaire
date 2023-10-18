import {
  Body,
  BodyProp,
  Controller,
  Example,
  Get,
  OperationId,
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
import { Question } from "../questions/question";
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
  @OperationId("teacherSignup")
  @Example({
    firstname: "amber",
    lastname: "nayak",
    username: "ambernayak@gmail.com",
    password: "12345678",
  })
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
  @OperationId("teacherLogin")
  public async login(
    @Body()
    teacherLoginParams: teacherLoginParams
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
  @OperationId("teacherGetUsername")
  public async getFirstname(@Request() req: CustomTeacherRequest) {
    const { teacherId } = req.headers;
    const teacher = await this.teachersService.getById(teacherId);
    if (teacher) {
      return { firstname: teacher.firstname };
    }
    throw new ApiError("teacher", 403, "teacher dose not exists");
  }
  @Get("profile")
  @Middlewares(authenticateTeacherJwt)
  @OperationId("teacherGetProfile")
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
  @OperationId("teacherUpdateProfile")
  @Example({
    firstname: "ankish",
    username: "ankishnayak@gmail.com",
    lastname: "updated nayak",
  })
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
  @OperationId("teacherLogout")
  public async logout(@Request() req: ExRequest) {
    this.setHeader("Set-Cookie", undefined);
  }
  @Get("questions")
  @Middlewares(authenticateTeacherJwt)
  @OperationId("teacherGetAllQuestions")
  public async getAllQuestions(): Promise<Question[]> {
    return await this.questionsService.getAllQuestions();
  }
  //   @Route("{:teacherId}")
  @Get("{:teacherId}/questions")
  @OperationId("teacherGetAllQuestionsOfTeacher")
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
  @OperationId("teacherGetAllMyQuestions")
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
  @OperationId("teacherCreateQuestion")
  @Example({
    title: "title",
    description: "describe title",
    question: "what is your name?",
    option1: "a",
    option2: "b",
    option3: "c",
    option4: "d",
    answer: "a",
  })
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
  @OperationId("teacherUpdateQuestion")
  @Example({
    title: "updated title",
    description: "describe title",
    question: "what is your name?",
    option1: "a",
    option2: "b",
    option3: "c",
    option4: "d",
    answer: "a",
  })
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
