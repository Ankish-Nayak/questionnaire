import {
  ApiProperty,
  ApiRequestTimeoutResponse,
  OmitType,
} from '@nestjs/swagger';
import { QuestionCreateDto } from 'src/questions/dto/questions.dto';
export class StudentSignupDto {
  @ApiProperty({
    default: 'amber',
  })
  firstname: string;
  @ApiProperty({
    default: 'nayak',
  })
  lastname: string;
  @ApiProperty({
    default: 'ambernayak@gmail.com',
  })
  username: string;
  @ApiProperty({
    default: '12345678',
  })
  password: string;
}

export class StudentLoginDto {
  @ApiProperty({
    default: 'ambernayak@gmail.com',
  })
  username: string;
  @ApiProperty({
    default: '12345678',
  })
  password: string;
}

export class StudentUpdateProfileDto {
  @ApiProperty({
    default: 'ambernayak@gmail.com',
  })
  username: string;
  @ApiProperty({
    default: 'amber',
  })
  firstname: string;
  @ApiProperty({
    default: 'nayak',
  })
  lastname: string;
}

export class StudentSignupR {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  message: string;
}

export class StudentLoginR {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  message: string;
}

export class StudentGetFirstnameR {
  @ApiProperty()
  firstname: string;
}

export class StudentGetProfileR extends StudentUpdateProfileDto {
  @ApiProperty()
  createdAt: Date;
}

export class StudentUpdateProfileR extends StudentUpdateProfileDto {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  message: string;
}

export class StudentGetQuestion extends OmitType(QuestionCreateDto, [
  'answer',
] as const) {
  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  creatorId: number;
}

export class StudentLogoutR {
  @ApiProperty()
  message: string;
}

export class StudentGetQuestionsR {
  @ApiProperty({ type: [StudentGetQuestion] })
  questions: StudentGetQuestion[];
}

export class StudentAttemptB {
  @ApiProperty()
  questionId: number;
  @ApiProperty()
  answer: string;
}
export class StudentAttemptsB {
  @ApiProperty({ type: [StudentAttemptB] })
  questions: StudentAttemptB[];
}
