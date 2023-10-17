import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Request,
  Response,
  Route,
} from "tsoa";
import { StudentsService } from "./studentsService";
import { Question } from "@prisma/client";
import { generateToken } from "../utils/generateToken";
import { Student } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
import { QuestionsService } from "../questions/questionsService";
import { authenticateStudentJwt } from "../middleware/auth";
import {
  CustomStudentExpressRequest,
  studentLoginParams,
  studentSignupParams,
  profileParams,
} from "./student";
@Route("students")
export class UsersController extends Controller {
  private studentService;
  private questionsService;
  constructor() {
    super();
    this.studentService = new StudentsService();
    this.questionsService = new QuestionsService();
  }
  @Middlewares(authenticateStudentJwt)
  @Get("me")
  public async getUsername(
    @Request() req: CustomStudentExpressRequest
  ): Promise<{ firstname: string }> {
    const { studentId } = req.headers;
    const student = this.studentService.getById(studentId);
    const studentData = await student;
    if (studentData) {
      return { firstname: studentData.firstname };
    }

    throw new ApiError("UserNotFound", 403, "student dose not exists");
  }
  @Post("login")
  public async login(
    @Body() studentParams: studentLoginParams
  ): Promise<{ firstname: string }> {
    const existingStudent =
      await this.studentService.authenticate(studentParams);
    if (existingStudent) {
      const { firstname, id } = existingStudent;
      await this.studentService.authenticate(studentParams);
      const token: string = generateToken(id, "student");
      this.setHeader("Set-Cookie", `student-token=${token}; HttpOnly`);
      return { firstname };
    }
    throw new ApiError("student", 403, "student dose not exists");
  }
  @Response(201, "Student created")
  @Post("signup")
  public async signup(
    @Body() studentParams: studentSignupParams
  ): Promise<{ firstname: string }> {
    const existingFirstname =
      await this.studentService.authenticate(studentParams);
    if (existingFirstname) {
      throw new ApiError("student error", 403, "student already exists");
    }
    const { firstname, id } = await this.studentService.create(studentParams);
    const token: string = generateToken(id, "student");
    this.setHeader("Set-Cookie", `student-token=${token}; HttpOnly`);
    return { firstname };
  }
  @Middlewares(authenticateStudentJwt)
  @Get("profile")
  public async getProfile(
    @Request() req: CustomStudentExpressRequest
  ): Promise<{ student: Student }> {
    const { studentId } = req.headers;
    const student = await this.studentService.getById(studentId);
    if (student) {
      return { student };
    }
    throw new ApiError("UserNotFound", 403, "student dose not exists");
  }
  @Middlewares(authenticateStudentJwt)
  @Post("profile")
  public async updateProfile(
    @Request() req: CustomStudentExpressRequest,
    @Body() profileParams: profileParams
  ): Promise<{ student: Student }> {
    const { studentId } = req.headers;
    const existingStudent = await this.studentService.getByUsername(
      profileParams.username
    );
    if (
      !existingStudent ||
      (existingStudent && existingStudent.id === studentId)
    ) {
      const student = await this.studentService.update(
        studentId,
        profileParams
      );
      return { student };
    } else {
      throw new ApiError("student", 400, "username taken");
    }
  }
  @Response(200, "student logged out")
  @Post("logout")
  @Middlewares(authenticateStudentJwt)
  public async logout(): Promise<void> {
    this.setHeader("Set-Cookie", undefined);
  }
  @Middlewares(authenticateStudentJwt)
  @Route("questions")
  @Get("{questionId}")
  public async getQuestion(
    @Request() req: CustomStudentExpressRequest,
    @Path("questionId") questionId: number
  ): Promise<{ question: Question }> {
    const question = await this.questionsService.getByQuestionId(questionId);
    if (question) {
      return { question };
    }
    throw new ApiError("student", 403, "question dose not exists");
  }
  @Middlewares(authenticateStudentJwt)
  @Get("questions")
  public async getQuestions(
    @Request() req: CustomStudentExpressRequest
  ): Promise<{ questions: Omit<Question, "answer">[] }> {
    const questions = await this.questionsService.getAllQuestions();
    if (questions) {
      const newQuestions = questions.map((question) => {
        const { answer: _, ...newQuestion } = question;
        return newQuestion;
      });
      return { questions: newQuestions };
    }
    throw new ApiError("student", 403, "student dose not exists");
  }
}
