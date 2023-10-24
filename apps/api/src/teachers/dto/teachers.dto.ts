import { ApiOperation, ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { QuestionCreateDto } from 'src/questions/dto/questions.dto';
export class TeacherSignupDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class TeacherLoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class TeacherUpdateProfileDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
}

export class TeacherLoginR extends PickType(TeacherSignupDto, [
  'firstname',
] as const) {}

export class TeacherFirstnameR extends PickType(TeacherSignupDto, [
  'firstname',
] as const) {}

export class TeacherGetProfileR extends TeacherUpdateProfileDto {
  @ApiProperty()
  createdAt: Date;
}

export class TeacherUpdateProfileR extends TeacherUpdateProfileDto {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  message: string;
}

export class TeacherGetQuestionR extends OmitType(QuestionCreateDto, [
  'answer',
] as const) {}
export class TeacherGetQuestionsR extends OmitType(QuestionCreateDto, [
  'answer',
] as const) {
  @ApiProperty({ type: [TeacherGetQuestionR] })
  questions: TeacherGetQuestionR[];
}

export class TeacherGetQuestionWithAnswerR extends QuestionCreateDto {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  id: number;
  @ApiProperty()
  creatorId: string;
}

export class TeacherCreateQuestionR {
  @ApiProperty()
  questionId: number;
  @ApiProperty()
  message: string;
}

export class TeacherLogoutR {
  @ApiProperty()
  message: string;
}

export class TeacherUpdateQuestionB extends QuestionCreateDto {}
export class TeacherUpdateQuestionR {
  @ApiProperty()
  questionId: number;
  @ApiProperty()
  message: string;
}
