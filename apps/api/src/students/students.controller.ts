import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Post,
  Req,
  Request,
  Response,
  Res,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request as ExRequest, Response as ExResponse } from 'express';
import {
  profileParams,
  profileTypes,
  studentLoginParams,
  studentLoginTypes,
  studentSignupParams,
  studentSignupTypes,
} from 'types';
import { IncomingHttpHeaders } from 'http2';
import { StudentsService } from './students/students.service';
import { PrismaClient, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { generateToken } from 'src/common/utils/generateToken';
import * as Cookies from 'cookies';
import { QuestionsService } from 'src/questions/questions/questions.service';
import * as jwt from 'jsonwebtoken';
import {
  StudentLoginDto,
  StudentSignupDto,
  StudentUpdateProfileDto,
} from './dto/students.dto';
export interface StudentRequest extends ExRequest {
  headers: IncomingHttpHeaders & { studentId: number; role: string };
}

@Controller('students')
export class StudentsController {
  private studentsService;
  private prisma;
  private questionsService;
  constructor() {
    this.prisma = new PrismaService();
    this.questionsService = new QuestionsService(this.prisma);
    this.studentsService = new StudentsService(this.prisma);
  }
  @Post('signup')
  @ApiOperation({
    operationId: 'studentSignup',
  })
  async signUp(
    @Body() signUpParam: StudentSignupDto,
    @Response() res: ExResponse,
    @Request() req: ExRequest,
  ) {
    const parsedInput = studentSignupTypes.safeParse(signUpParam);
    if (!parsedInput.success) {
      res.status(411).json({ error: parsedInput.error });
    } else {
      const data = parsedInput.data;
      const existingStudent = await this.studentsService.student({
        username: data.username,
      });
      if (existingStudent) {
        res.status(403).json({ message: 'student already exists' });
      } else {
        const student = await this.studentsService.createStudent(data);
        const token = generateToken(student.id, 'student');
        const cookies = new Cookies(req, res);
        cookies.set('student-token', token, { httpOnly: true });
        res.status(200).json({
          firstname: student.firstname,
          message: 'student created successfully',
        });
      }
    }
  }

  @Post('login')
  @ApiOperation({
    operationId: 'studentLogin',
  })
  @ApiResponse({ status: 200, description: 'student logged in' })
  async login(
    @Body() loginParams: StudentLoginDto,
    @Response() res: ExResponse,
    @Request() req: ExRequest,
  ) {
    const parsedInput = studentLoginTypes.safeParse(loginParams);
    if (!parsedInput.success) {
      res.status(411).json({ error: parsedInput.error });
    } else {
      const data = parsedInput.data;
      const existingStudent = await this.studentsService.student(data);
      if (existingStudent) {
        const token = generateToken(existingStudent.id, 'student');
        const cookies = new Cookies(req, res);
        cookies.set('student-token', token, { httpOnly: true });
        res.status(200).json({
          message: 'student logged in',
          firstname: existingStudent.firstname,
        });
      } else {
        res.status(403).json({ message: 'student dose not exists' });
      }
    }
  }

  @Get('me')
  @ApiOperation({
    operationId: 'studentGetFirstname',
  })
  async getFirstname(@Req() req: StudentRequest, @Res() res: ExResponse) {
    const { studentId } = req.headers;
    const existingStudent = await this.studentsService.student({
      id: studentId,
    });
    if (existingStudent) {
      res.status(200).json({ firstname: existingStudent.firstname });
    } else {
      res.status(403).json({ message: 'student dose not exists' });
    }
  }

  @Get('profile')
  @ApiOperation({
    operationId: 'studentGetProfile',
  })
  async getProfile(@Req() req: StudentRequest, @Res() res: ExResponse) {
    const { studentId } = req.headers;
    console.log(studentId);
    const existingStudent = await this.studentsService.student({
      id: studentId,
    });
    if (existingStudent) {
      const { password: _, id: __, ...profile } = existingStudent;
      res.status(200).json({ profile });
    }
  }

  @Post('profile')
  @ApiOperation({
    operationId: 'studentUpdateProfile',
  })
  async updateProfile(
    @Req() req: StudentRequest,
    @Body() param: StudentUpdateProfileDto,
    @Res() res: ExResponse,
  ) {
    const { studentId } = req.headers;
    const existingStudent = await this.studentsService.student({
      id: studentId,
    });
    if (existingStudent) {
      const parsedInput = profileTypes.safeParse(param);
      if (!parsedInput.success) {
        res.status(411).json({ error: parsedInput.error });
      } else {
        const data = parsedInput.data;
        const updatedStudent = await this.studentsService.updateStudent({
          where: { id: studentId },
          data,
        });
        const token = generateToken(updatedStudent.id, 'student');
        const cookies = new Cookies(req, res);
        cookies.set('student-token', token, { httpOnly: true });
        const { password: _, id: __, ...profile } = updatedStudent;
        res.status(200).json({ message: 'profile updated', profile });
      }
    } else {
      res.status(403).json({ message: 'student dose not exists' });
    }
  }

  @Get('questions/:questionId')
  @ApiOperation({
    operationId: 'studentGetQuestion',
  })
  async getQuestion(
    @Req() req: StudentRequest,
    @Res() res: ExResponse,
    @Param('questionId') questionId: number,
  ) {
    const question = await this.questionsService.question({ id: questionId });
    if (question) {
      const { answer: _, ...resQuestion } = question;
      res.status(200).json({ question: resQuestion });
    } else {
      res.status(403).json({ message: 'question dose not exists' });
    }
  }

  @Get('questions')
  @ApiOperation({
    operationId: 'studentGetQuestions',
  })
  async getQuestions(@Res() res: ExResponse) {
    const questions = await this.questionsService.questions();
    const newQuestions = questions.map((question) => {
      const { answer: _, ...newQuestion } = question;
      res.status(200).json({ question: newQuestion });
    });
    res.status(200).json({ questions: newQuestions });
  }
}
