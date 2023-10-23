import { ApiProperty } from '@nestjs/swagger';

export class QuestionCreateDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  question: string;
  @ApiProperty()
  option1: string;
  @ApiProperty()
  option2: string;
  @ApiProperty()
  option3: string;
  @ApiProperty()
  option4: string;
  @ApiProperty()
  answer: string;
}

export class QuestionUpdateDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  question: string;
  @ApiProperty()
  option1: string;
  @ApiProperty()
  option2: string;
  @ApiProperty()
  option3: string;
  @ApiProperty()
  option4: string;
  @ApiProperty()
  answer: string;
}
