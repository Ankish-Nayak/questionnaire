/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionCreateDto } from '../models/QuestionCreateDto';
import type { StudentAttemptsB } from '../models/StudentAttemptsB';
import type { StudentAttemptsR } from '../models/StudentAttemptsR';
import type { StudentGetFirstnameR } from '../models/StudentGetFirstnameR';
import type { StudentGetProfileR } from '../models/StudentGetProfileR';
import type { StudentGetQuestionR } from '../models/StudentGetQuestionR';
import type { StudentGetQuestionsR } from '../models/StudentGetQuestionsR';
import type { StudentLoginDto } from '../models/StudentLoginDto';
import type { StudentLoginR } from '../models/StudentLoginR';
import type { StudentLogoutR } from '../models/StudentLogoutR';
import type { StudentSignupDto } from '../models/StudentSignupDto';
import type { StudentSignupR } from '../models/StudentSignupR';
import type { StudentUpdateProfileDto } from '../models/StudentUpdateProfileDto';
import type { StudentUpdateProfileR } from '../models/StudentUpdateProfileR';
import type { TeacherCreateQuestionR } from '../models/TeacherCreateQuestionR';
import type { TeacherFirstnameR } from '../models/TeacherFirstnameR';
import type { TeacherGetProfileR } from '../models/TeacherGetProfileR';
import type { TeacherGetQuestionsR } from '../models/TeacherGetQuestionsR';
import type { TeacherGetQuestionWithAnswerR } from '../models/TeacherGetQuestionWithAnswerR';
import type { TeacherLoginDto } from '../models/TeacherLoginDto';
import type { TeacherLoginR } from '../models/TeacherLoginR';
import type { TeacherLogoutR } from '../models/TeacherLogoutR';
import type { TeacherSignupDto } from '../models/TeacherSignupDto';
import type { TeacherUpdateProfileDto } from '../models/TeacherUpdateProfileDto';
import type { TeacherUpdateProfileR } from '../models/TeacherUpdateProfileR';
import type { TeacherUpdateQuestionB } from '../models/TeacherUpdateQuestionB';
import type { TeacherUpdateQuestionR } from '../models/TeacherUpdateQuestionR';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static appControllerGetHello(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }

    /**
     * @param requestBody
     * @returns StudentSignupR
     * @throws ApiError
     */
    public static studentSignup(
        requestBody: StudentSignupDto,
    ): CancelablePromise<StudentSignupR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns StudentLoginR
     * @throws ApiError
     */
    public static studentLogin(
        requestBody: StudentLoginDto,
    ): CancelablePromise<StudentLoginR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns StudentGetFirstnameR
     * @throws ApiError
     */
    public static studentGetFirstname(): CancelablePromise<StudentGetFirstnameR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/me',
        });
    }

    /**
     * @returns StudentUpdateProfileR
     * @throws ApiError
     */
    public static studentGetProfile(): CancelablePromise<StudentUpdateProfileR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/profile',
        });
    }

    /**
     * @param requestBody
     * @returns StudentGetProfileR
     * @throws ApiError
     */
    public static studentUpdateProfile(
        requestBody: StudentUpdateProfileDto,
    ): CancelablePromise<StudentGetProfileR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param questionId
     * @returns StudentGetQuestionR
     * @throws ApiError
     */
    public static studentGetQuestion(
        questionId: number,
    ): CancelablePromise<StudentGetQuestionR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/questions/{questionId}',
            path: {
                'questionId': questionId,
            },
        });
    }

    /**
     * @returns StudentGetQuestionsR
     * @throws ApiError
     */
    public static studentGetQuestions(): CancelablePromise<StudentGetQuestionsR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/questions',
        });
    }

    /**
     * @returns StudentLogoutR
     * @throws ApiError
     */
    public static studentLogout(): CancelablePromise<StudentLogoutR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/logout',
        });
    }

    /**
     * @param requestBody
     * @returns StudentAttemptsR
     * @throws ApiError
     */
    public static studentAttempt(
        requestBody: StudentAttemptsB,
    ): CancelablePromise<StudentAttemptsR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/attempt',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns TeacherLoginR
     * @throws ApiError
     */
    public static teacherSignup(
        requestBody: TeacherSignupDto,
    ): CancelablePromise<TeacherLoginR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns TeacherLoginR
     * @throws ApiError
     */
    public static teacherLogin(
        requestBody: TeacherLoginDto,
    ): CancelablePromise<TeacherLoginR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns TeacherFirstnameR
     * @throws ApiError
     */
    public static teacherGetFirstname(): CancelablePromise<TeacherFirstnameR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/me',
        });
    }

    /**
     * @returns TeacherGetProfileR
     * @throws ApiError
     */
    public static teacherGetProfile(): CancelablePromise<TeacherGetProfileR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/profile',
        });
    }

    /**
     * @param requestBody
     * @returns TeacherUpdateProfileR
     * @throws ApiError
     */
    public static teacherUpdateProfile(
        requestBody: TeacherUpdateProfileDto,
    ): CancelablePromise<TeacherUpdateProfileR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns TeacherGetQuestionsR
     * @throws ApiError
     */
    public static teacherGetQuestions(): CancelablePromise<TeacherGetQuestionsR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/questions',
        });
    }

    /**
     * @param requestBody
     * @returns TeacherCreateQuestionR
     * @throws ApiError
     */
    public static teacherCreateQuestion(
        requestBody: QuestionCreateDto,
    ): CancelablePromise<TeacherCreateQuestionR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/questions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param questionId
     * @param requestBody
     * @returns TeacherUpdateQuestionR
     * @throws ApiError
     */
    public static teacherUpdateQuestion(
        questionId: number,
        requestBody: TeacherUpdateQuestionB,
    ): CancelablePromise<TeacherUpdateQuestionR> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/teachers/questions',
            query: {
                'questionId': questionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param questionId
     * @returns TeacherGetQuestionWithAnswerR
     * @throws ApiError
     */
    public static teacherGetQuestion(
        questionId: number,
    ): CancelablePromise<TeacherGetQuestionWithAnswerR> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/questions/{questionId}',
            path: {
                'questionId': questionId,
            },
        });
    }

    /**
     * @param teacherId
     * @returns any
     * @throws ApiError
     */
    public static teacherGetParticularTeacherQuestions(
        teacherId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/{teacherId}/questions',
            path: {
                'teacherId': teacherId,
            },
        });
    }

    /**
     * @returns TeacherLogoutR
     * @throws ApiError
     */
    public static teacherLogout(): CancelablePromise<TeacherLogoutR> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/logout',
        });
    }

}
