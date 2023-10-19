import { ApiProperty } from '@nestjs/swagger';
export class StudentSignupDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class StudentLoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class StudentUpdateProfileDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  password: string;
}
