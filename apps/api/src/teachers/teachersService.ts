import { teacherLoginTypes, profileTypes } from "types";
import { ApiError } from "../errors/ApiError";
import { prisma } from "../app";
import { Teacher } from "./teacher";
import {
  teacherLoginParams,
  teacherSignupParams,
  teacherProfileParams,
} from "./teacher";
export class TeachersService {
  public async create(teacherParams: teacherSignupParams): Promise<Teacher> {
    const parsedInput = teacherLoginTypes.safeParse(teacherParams);
    if (!parsedInput.success) {
      throw new ApiError("teacher", 411, JSON.stringify(parsedInput.error));
    }
    try {
      const teacher = await prisma.teacher.create({
        data: { ...teacherParams },
      });
      return teacher;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, "db error");
    }
  }
  public async getById(teacherId: number): Promise<Teacher | null> {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
      });
      return teacher;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, "db error");
    }
  }
  public async getByUsername(username: string): Promise<Teacher | null> {
    try {
      const teacher = await prisma.teacher.findUnique({ where: { username } });
      return teacher;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, "db error");
    }
  }
  public async update(
    teacherProfileParams: teacherProfileParams,
    teacherId: number
  ): Promise<Teacher> {
    const parsedInput = profileTypes.safeParse(teacherProfileParams);
    if (!parsedInput.success) {
      throw new ApiError(
        "teacher",
        411,
        JSON.stringify({ error: parsedInput.error })
      );
    }
    const data = parsedInput.data;
    try {
      const updatedTeacher = await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          ...data,
        },
      });
      return updatedTeacher;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, "db error");
    }
  }
  public async authenticate(
    teacherLoginParams: teacherLoginParams
  ): Promise<Teacher | null> {
    const parsedInput = teacherLoginTypes.safeParse(teacherLoginParams);
    if (!parsedInput.success) {
      throw new ApiError(
        "teacher",
        411,
        JSON.stringify({ error: parsedInput.error })
      );
    }
    try {
      const { username, password } = parsedInput.data;
      const teacher = await prisma.teacher.findUnique({
        where: { username, password },
      });
      return teacher;
    } catch (e) {
      console.log(e);
      throw new ApiError("db error", 500, "db error");
    }
  }
}
