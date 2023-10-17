import { teacherSignupTypes, teacherLoginTypes, profileTypes } from "types";
import { IncomingHttpHeaders } from "http2";
import { Request } from "express";
export type teacherSignupParams = ReturnType<typeof teacherSignupTypes.parse>;
export type teacherLoginParams = ReturnType<typeof teacherLoginTypes.parse>;
export type teacherProfileParams = ReturnType<typeof profileTypes.parse>;

// export type teache = ReturnType<typeof teacherLoginTypes
export interface teacherToken {
  teacherId: number;
  isTeacher: boolean;
}
export interface CustomTeacherRequest extends Request {
  headers: IncomingHttpHeaders & teacherToken;
}
