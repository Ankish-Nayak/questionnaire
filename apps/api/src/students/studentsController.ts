import {
  Body,
  Controller,
  Example,
  Get,
  Middlewares,
  OperationId,
  Path,
  Post,
  Request,
  Response,
  Route,
} from "tsoa";
import { StudentsService } from "./studentsService";
import { generateToken } from "../utils/generateToken";
import { Question } from "../questions/question";
import { Student } from "./student";
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
export class StudentsController extends Controller {
  private studentService;
  private questionsService;
  constructor() {
    super();
    this.studentService = new StudentsService();
    this.questionsService = new QuestionsService();
  }
  @Middlewares(authenticateStudentJwt)
  @Get("me")
  @OperationId("studentGetUsername")
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
  @OperationId("studentLogin")
  @Example<studentLoginParams>({
    username: "ambernayak@gmail.com",
    password: "12345678",
  })
  public async login(
    @Body()
    studentParams: studentLoginParams
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
  @OperationId("studentSignup")
  public async signup(
    @Body()
    @Example({
      firstname: "amber",
      lastname: "nayak",
      username: "ambernayak@gmail.com",
      password: "12345678",
    })
    studentParams: studentSignupParams
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
  @OperationId("studentGetProfile")
  public async getProfile(
    @Request() req: CustomStudentExpressRequest
  ): Promise<{ student: Omit<Student, "password"> }> {
    const { studentId } = req.headers;
    const student = await this.studentService.getById(studentId);
    if (student) {
      const { password: _, ...newStudent } = student;
      return { student: newStudent };
    }
    throw new ApiError("UserNotFound", 403, "student dose not exists");
  }
  @Middlewares(authenticateStudentJwt)
  @Post("profile")
  @OperationId("studentUpdateProfile")
  public async updateProfile(
    @Request()
    req: CustomStudentExpressRequest,
    @Body()
    @Example({
      firstname: "amber",
      lastname: "updated nayak",
      username: "ambernayak@gmail.com",
    })
    profileParams: profileParams
  ): Promise<{ student: Omit<Student, "password"> }> {
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
      const { password: _, ...newStudent } = student;
      return { student: newStudent };
    } else {
      throw new ApiError("student", 400, "username taken");
    }
  }
  @Response(200, "student logged out")
  @Post("logout")
  @Middlewares(authenticateStudentJwt)
  @OperationId("studentLogout")
  public async logout(): Promise<void> {
    this.setHeader("Set-Cookie", undefined);
  }
  @Middlewares(authenticateStudentJwt)
  @Route("questions")
  @Get("{questionId}")
  @OperationId("studentGetQuestion")
  public async getQuestion(
    @Request() req: CustomStudentExpressRequest,
    @Path("questionId") questionId: number
  ): Promise<{ question: Omit<Question, "answer"> }> {
    const question = await this.questionsService.getByQuestionId(questionId);
    if (question) {
      const { answer: _, ...newQuestion } = question;
      return { question: newQuestion };
    }
    throw new ApiError("student", 403, "question dose not exists");
  }
  @Middlewares(authenticateStudentJwt)
  @Get("questions")
  @OperationId("studentGetAllQuestions")
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
