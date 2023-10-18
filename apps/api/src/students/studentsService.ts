import { prisma } from "../app";
import { Student } from "./student";
import { ApiError } from "../errors/ApiError";
import { studentLoginTypes, studentSignupTypes } from "types";
import {
  studentLoginParams,
  studentSignupParams,
  profileParams,
} from "./student";

export type StudentCreationParams = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};

export class StudentsService {
  public async getById(id: number): Promise<Student | null> {
    try {
      const student = await prisma.student.findUnique({ where: { id: id } });
      return student;
    } catch (e) {
      throw new ApiError("db error", 500, JSON.stringify(e));
    }
  }
  public async getByUsername(username: string): Promise<Student | null> {
    try {
      const student = await prisma.student.findUnique({ where: { username } });
      return student;
    } catch (e) {
      throw new ApiError("db error", 500, JSON.stringify(e));
    }
  }
  public async create(
    studentCreationParams: studentSignupParams
  ): Promise<{ firstname: string; id: number }> {
    const parsedInput = studentSignupTypes.safeParse(studentCreationParams);
    if (!parsedInput.success) {
      throw new ApiError(
        "student",
        411,
        JSON.stringify({ error: parsedInput.error })
      );
    }
    const { username, firstname, lastname, password } = parsedInput.data;
    try {
      const student = await prisma.student.create({
        data: {
          username,
          firstname,
          lastname,
          password,
        },
      });
      return { firstname: student.firstname, id: student.id };
    } catch (e) {
      throw new ApiError("db error", 500, JSON.stringify(e));
    }
  }
  public async authenticate(
    studentLoginParams: studentLoginParams
  ): Promise<{ firstname: string; id: number } | null> {
    const parsedInput = studentLoginTypes.safeParse(studentLoginParams);
    if (!parsedInput.success) {
      throw new ApiError(
        "student",
        411,
        JSON.stringify({ error: parsedInput.error })
      );
    }
    const { username, password } = parsedInput.data;
    try {
      const student = await prisma.student.findUnique({
        where: { username, password },
      });
      return student;
    } catch (e) {
      if (e instanceof ApiError) {
        throw new ApiError("student", 401, "student dose not exists");
      }
      throw new ApiError("db error", 500, JSON.stringify(e));
    }
  }
  public async update(
    id: number,
    profileParams: profileParams
  ): Promise<Student> {
    try {
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: { ...profileParams },
      });
      return updatedStudent;
    } catch (e) {
      throw new ApiError("db error", 500, JSON.stringify(e));
    }
  }
}
