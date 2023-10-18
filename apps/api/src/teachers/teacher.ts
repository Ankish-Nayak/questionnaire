import { IncomingHttpHeaders } from "http2";
import { Request } from "express";
export type teacherSignupParams = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};
export type teacherProfileParams = {
  username: string;
  firstname: string;
  lastname: string;
};
export type teacherLoginParams = {
  username: string;
  password: string;
};
// export type teache = ReturnType<typeof teacherLoginTypes
export interface teacherToken {
  teacherId: number;
  isTeacher: boolean;
}
export interface CustomTeacherRequest extends Request {
  headers: IncomingHttpHeaders & teacherToken;
}

export interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
}
