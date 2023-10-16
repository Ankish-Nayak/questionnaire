import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import { StudentsService } from "./studentsService";
// import { authenticateStudentJwt } from "../middleware/auth";
// import { studentLoginParams, studentSignupParams } from "types";
export type studentLoginParams = ReturnType<typeof studentLoginTypes.parse>;
export type studentSignupParams = ReturnType<typeof studentSignupTypes.parse>;
export type profileParams = ReturnType<typeof profileTypes.parse>;
import { generateToken } from "../generateToken";
import { profileTypes, studentLoginTypes, studentSignupTypes } from "types";
import { TypeOf } from "zod";
import { Student } from "@prisma/client";
import { ApiError } from "../errors/ApiError";
@Route("students")
export class UsersController extends Controller {
  private studentService;
  constructor() {
    super();
    this.studentService = new StudentsService();
  }
  @Security("jwt")
  @Get("me")
  public async getUsername(@Request() req: any): Promise<string> {
    console.log(req.user);
    const student = this.studentService.getByUsername(req.user.username);
    const studentData = await student;
    if (studentData) {
      return studentData.firstname;
    }
    throw new ApiError("UserNotFound", 403, "student dose not exists");
  }
  @Post("login")
  public async login(
    @Body() studentParams: studentLoginParams
  ): Promise<{ firstname: string }> {
    const { firstname, id } =
      await this.studentService.authenticate(studentParams);
    const token: string = generateToken(id, "student");
    this.setHeader("Set-Cookie", `student-token=${token}; HttpOnly`);
    return { firstname };
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
  @Security("jwt", ["student"])
  @Get("profile")
  public async getProfile(@Request() req: any) {
    console.log(req.user);
    const student = await this.studentService.getByUsername(req.user.username);
    if (student) {
      return student;
    }
    throw new ApiError("UserNotFound", 403, "student dose not exists");
  }
  @Security("jwt", ["student"])
  @Post("profile")
  public async updateProfile(
    @Request() req: any,
    @Body() profileParams: profileParams
  ) {
    console.log(req.user);
    const existingStudent = await this.studentService.getByUsername(
      profileParams.username
    );
    if (existingStudent && existingStudent.id === req.user.id) {
      const student = await this.studentService.update(
        req.user.id,
        profileParams
      );
      return student;
    } else if (!existingStudent) {
      throw new ApiError("UserNotFound", 403, "student dose not exists");
    } else if (existingStudent && existingStudent.id !== req.user.id) {
      throw new ApiError("student", 400, "username taken");
    }
  }
  @Response(200, "student logged out")
  @Post("logout")
  @Security("jwt", ["student"])
  public async logout() {
    this.setHeader("Set-Cookie", undefined);
  }
}
