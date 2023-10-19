import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  password: string;
}
