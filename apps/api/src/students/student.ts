import { Request } from "express";

import { profileTypes, studentLoginTypes, studentSignupTypes } from "types";
export type studentLoginParams = ReturnType<typeof studentLoginTypes.parse>;
export type studentSignupParams = ReturnType<typeof studentSignupTypes.parse>;
export type profileParams = ReturnType<typeof profileTypes.parse>;
export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
}

import { IncomingHttpHeaders } from "http2";
interface studentToken {
  studentId: number;
  role: string;
}
type customheaders = { teacherId: number; role: string } & IncomingHttpHeaders;

export interface CustomStudentExpressRequest extends Request {
  headers: IncomingHttpHeaders & studentToken;
}
