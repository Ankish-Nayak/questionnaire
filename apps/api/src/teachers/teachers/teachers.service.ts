import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaClient) {}
  async createTeacher(data: Prisma.TeacherCreateInput) {
    return this.prisma.teacher.create({ data });
  }
  async teacher(where: Prisma.TeacherWhereUniqueInput) {
    return this.prisma.teacher.findUnique({ where });
  }
  async teachers(where: Prisma.TeacherWhereInput) {
    return this.prisma.teacher.findMany({ where });
  }
  async updateTeacher(param: {
    where: Prisma.TeacherWhereUniqueInput;
    data: Prisma.TeacherUpdateInput;
  }) {
    return this.prisma.teacher.update(param);
  }
  async teacherQuestions(where: Prisma.TeacherWhereUniqueInput) {
    return this.prisma.teacher.findUnique({
      where,
      include: { questions: true },
    });
  }
}
