import { teacherSignupTypes, teacherLoginTypes } from "types";
export type teacherSignupParams = ReturnType<typeof teacherSignupTypes.parse>;
export type teacherLoginParams = ReturnType<typeof teacherLoginTypes.parse>;
export class TeachersService {
  public async create(teacherParams: teacherSignupParams) {
    const parsedInput = teacherLoginTypes.safeParse(teacherParams);
  }
}
