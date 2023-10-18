import { Request } from "express";

export type studentLoginParams = {
  username: string;
  password: string;
};
export type profileParams = {
  firstname: string;
  lastname: string;
  username: string;
};

export type studentSignupParams = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};
export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  createdAt: Date;
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
