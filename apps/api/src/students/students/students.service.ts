import { Injectable } from '@nestjs/common';
import { Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async student(
    studentWhereUniqueInput: Prisma.StudentWhereUniqueInput,
  ): Promise<Student | null> {
    return this.prisma.student.findUnique({ where: studentWhereUniqueInput });
  }
  async students(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StudentWhereUniqueInput;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.student.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async createStudent(data: Prisma.StudentCreateInput): Promise<Student> {
    return this.prisma.student.create({ data });
  }
  async updateStudent(params: {
    where: Prisma.StudentWhereUniqueInput;
    data: Prisma.StudentUpdateInput;
  }): Promise<Student> {
    const { where, data } = params;
    return this.prisma.student.update({ where, data });
  }
}
