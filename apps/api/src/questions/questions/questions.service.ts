import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}
  async createQuestion(param: {
    data: Prisma.QuestionCreateWithoutTeacherInput;
    creatorId: number;
  }) {
    const { data, creatorId } = param;
    return this.prisma.question.create({ data: { ...data, creatorId } });
  }
  async updateQuestion(
    where: Prisma.QuestionWhereUniqueInput,
    data: Prisma.QuestionUpdateInput,
  ) {
    return this.prisma.question.update({ where, data });
  }
  async question(where: Prisma.QuestionWhereUniqueInput) {
    return this.prisma.question.findUnique({ where });
  }
  async questions() {
    return this.prisma.question.findMany({});
  }
}
