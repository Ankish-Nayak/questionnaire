import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { TeachersService } from './teachers/teachers.service';
import { Response as ExResponse, Request as ExRequest } from 'express';
import { QuestionsService } from 'src/questions/questions/questions.service';
import { PrismaService } from 'src/prisma.service';
import {
  teacherLoginParams,
  teacherLoginTypes,
  profileParams,
  profileTypes,
  teacherSignupParams,
  teacherSignupTypes,
  questionTypes,
} from 'types';

import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PickType, OmitType } from '@nestjs/mapped-types';
import { generateToken } from 'src/common/utils/generateToken';
import * as Cookies from 'cookies';
import { IncomingHttpHeaders } from 'http2';
import {
  TeacherCreateQuestionR,
  TeacherFirstnameR,
  TeacherGetProfileR,
  TeacherGetQuestionWithAnswerR,
  TeacherGetQuestionsR,
  TeacherLoginDto,
  TeacherLoginR,
  TeacherLogoutR,
  TeacherSignupDto,
  TeacherUpdateProfileDto,
  TeacherUpdateProfileR,
} from './dto/teachers.dto';
import { QuestionCreateDto } from 'src/questions/dto/questions.dto';
import { string } from 'zod';
import { StudentLoginDto } from 'src/students/dto/students.dto';
export interface TeacherRequest extends ExRequest {
  headers: IncomingHttpHeaders & { teacherId: number; role: string };
}

@Controller('teachers')
export class TeachersController {
  private teachersService;
  private questionsService;
  private prisma;
  constructor() {
    this.prisma = new PrismaService();
    this.teachersService = new TeachersService(this.prisma);
    this.questionsService = new QuestionsService(this.prisma);
  }

  @Post('signup')
  @ApiOperation({
    operationId: 'teacherSignup',
  })
  @ApiOkResponse({
    type: TeacherLoginR,
  })
  async signUp(
    @Body() signUpParam: TeacherSignupDto,
    @Res() res: ExResponse,
    @Req() req: ExRequest,
  ) {
    const parsedInput = teacherSignupTypes.safeParse(signUpParam);
    if (!parsedInput.success) {
      res.status(411).json({ error: parsedInput.error });
    } else {
      const data = parsedInput.data;
      const existingteacher = await this.teachersService.teacher({
        username: data.username,
      });
      if (existingteacher) {
        res.status(403).json({ message: 'teacher already exists' });
      } else {
        const teacher = await this.teachersService.createTeacher(data);
        const token = generateToken(teacher.id, 'teacher');
        const cookies = new Cookies(req, res);
        cookies.set('teacher-token', token, { httpOnly: true });
        res.status(200).json({
          firstname: teacher.firstname,
          message: 'teacher created successfully',
        });
      }
    }
  }

  @Post('login')
  @ApiOperation({
    operationId: 'teacherLogin',
  })
  @ApiOkResponse({
    type: TeacherLoginR,
  })
  async login(
    @Body() loginParams: TeacherLoginDto,
    @Res() res: ExResponse,
    @Req() req: ExRequest,
  ) {
    const parsedInput = teacherLoginTypes.safeParse(loginParams);
    if (!parsedInput.success) {
      res.status(411).json({ error: parsedInput.error });
    } else {
      const data = parsedInput.data;
      const existingteacher = await this.teachersService.teacher(data);
      if (existingteacher) {
        const token = generateToken(existingteacher.id, 'teacher');
        const cookies = new Cookies(req, res);
        cookies.set('teacher-token', token, { httpOnly: true });
        res.status(200).json({
          message: 'teacher logged in',
          firstname: existingteacher.firstname,
        });
      } else {
        res.status(403).json({ message: 'teacher dose not exists' });
      }
    }
  }

  @Get('me')
  @ApiOperation({
    operationId: 'teacherGetFirstname',
  })
  @ApiOkResponse({
    type: TeacherFirstnameR,
  })
  async getFirstname(@Req() req: TeacherRequest, @Res() res: ExResponse) {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.teacher({
      id: teacherId,
    });
    if (existingTeacher) {
      res.status(200).json({ firstname: existingTeacher.firstname });
    } else {
      res.status(403).json({ message: 'teacher dose not exists' });
    }
  }

  @Get('profile')
  @ApiOperation({
    operationId: 'teacherGetProfile',
  })
  @ApiOkResponse({
    type: TeacherGetProfileR,
  })
  async getProfile(@Req() req: TeacherRequest, @Res() res: ExResponse) {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.teacher({
      id: teacherId,
    });
    if (existingTeacher) {
      const { password: _, id: __, ...profile } = existingTeacher;
      res.status(200).json({ profile });
    }
  }

  @Post('profile')
  @ApiOperation({
    operationId: 'teacherUpdateProfile',
  })
  @ApiOkResponse({
    type: TeacherUpdateProfileR,
  })
  async updateProfile(
    @Req() req: TeacherRequest,
    @Body() param: TeacherUpdateProfileDto,
    @Res() res: ExResponse,
  ) {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.teacher({
      id: teacherId,
    });
    if (existingTeacher) {
      const parsedInput = profileTypes.safeParse(param);
      if (!parsedInput.success) {
        res.status(411).json({ error: parsedInput.error });
      } else {
        const data = parsedInput.data;
        const updatedTeacher = await this.teachersService.updateTeacher({
          where: { id: teacherId },
          data,
        });
        const token = generateToken(updatedTeacher.id, 'teacher');
        const cookies = new Cookies(req, res);
        cookies.set('teacher-token', token, { httpOnly: true });
        const { password: _, id: __, ...profile } = updatedTeacher;
        res.status(200).json({ message: 'profile updated', profile });
      }
    } else {
      res.status(403).json({ message: 'teacher dose not exists' });
    }
  }

  // all teacher questions
  @Get('questions')
  @ApiOperation({
    operationId: 'teacherGetQuestions',
  })
  @ApiOkResponse({
    type: TeacherGetQuestionsR,
    isArray: true,
  })
  async getQuestions(@Res() res: ExResponse) {
    const questions = await this.questionsService.questions();
    const newQuestions = questions.map((question) => {
      const { answer: _, ...newQuestion } = question;
      res.status(200).json({ question: newQuestion });
    });
    res.status(200).json({ questions: newQuestions });
  }

  // particular question
  @Get('questions/:questionId')
  @ApiOperation({
    operationId: 'teacherGetQuestion',
  })
  @ApiOkResponse({
    type: TeacherGetQuestionWithAnswerR,
  })
  async getQuestionWithAnswer(
    @Param('questionId') questionId: number,
    @Res() res: ExResponse,
  ) {
    const question = await this.questionsService.question({ id: questionId });
    if (question) {
      res.status(200).json({ question });
    } else {
      res.status(403).json({ message: 'question dose not exists' });
    }
  }

  // particular teacher all questions
  @Get('/:teacherId/questions')
  @ApiOperation({
    operationId: 'teacherGetParticularTeacherQuestions',
  })
  async getParticularTeacherQuestions(
    @Param('teacherId') teacherId: number,
    @Res() res: ExResponse,
    @Req() req: TeacherRequest,
  ) {
    const teacher = await this.teachersService.teacherQuestions({
      id: teacherId,
    });
    if (teacher) {
      let questions = [];
      // not logged in teacher then omit answer
      if (teacherId !== req.headers.teacherId) {
        questions = teacher.questions.map((question) => {
          const { answer: _, ...newQuestion } = question;
          res.status(200).json({ question: newQuestion });
        });
      } else {
        questions = teacher.questions;
      }
      res.status(200).json({ questions });
    } else {
      res.status(403).json({ message: 'teacher dose not exists' });
    }
  }
  @Post('questions')
  @ApiOperation({
    operationId: 'teacherCreateQuestion',
  })
  @ApiOkResponse({
    type: TeacherCreateQuestionR,
  })
  async createQuestion(
    @Body() param: QuestionCreateDto,
    @Req() req: TeacherRequest,
    @Res() res: ExResponse,
  ) {
    const parsedInput = questionTypes.safeParse(param);
    if (!parsedInput.success) {
      res.status(411).json({ error: parsedInput.error });
    } else {
      const { teacherId } = req.headers;
      const existingStudent = await this.teachersService.teacher({
        id: teacherId,
      });
      if (existingStudent) {
        const data = parsedInput.data;
        const question = await this.questionsService.createQuestion({
          data: data,
          creatorId: existingStudent.id,
        });
        res.status(200).json({
          message: 'question created successfully',
          questionId: question.id,
        });
      }
    }
  }

  @Post('logout')
  @ApiOperation({
    operationId: 'teacherLogout',
  })
  @ApiOkResponse({
    type: TeacherLogoutR,
  })
  async logout(@Req() req: TeacherRequest, @Res() res: ExResponse) {
    const { teacherId } = req.headers;
    const existingTeacher = await this.teachersService.teacher({
      id: teacherId,
    });
    if (existingTeacher) {
      const cookies = new Cookies(req, res);
      cookies.set('teacher-token', null);
      res.status(200).json({ message: 'teacher logged out' });
    } else {
      res.status(403).json({ message: 'teacher dose not exists' });
    }
  }
}
