/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Omit_Question_answer_ } from '../models/Omit_Question_answer_';
import type { Omit_questionParams_answer_ } from '../models/Omit_questionParams_answer_';
import type { Omit_Student_password_ } from '../models/Omit_Student_password_';
import type { profileParams } from '../models/profileParams';
import type { Question } from '../models/Question';
import type { questionParams } from '../models/questionParams';
import type { studentLoginParams } from '../models/studentLoginParams';
import type { studentSignupParams } from '../models/studentSignupParams';
import type { teacherLoginParams } from '../models/teacherLoginParams';
import type { teacherProfileParams } from '../models/teacherProfileParams';
import type { teacherSignupParams } from '../models/teacherSignupParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static studentGetUsername(): CancelablePromise<{
        firstname: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/me',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static studentLogin(
        requestBody: studentLoginParams,
    ): CancelablePromise<{
        firstname: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static studentSignup(
        requestBody: studentSignupParams,
    ): CancelablePromise<{
        firstname: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static studentGetProfile(): CancelablePromise<{
        student: Omit_Student_password_;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/profile',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static studentUpdateProfile(
        requestBody: profileParams,
    ): CancelablePromise<{
        student: Omit_Student_password_;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any student logged out
     * @throws ApiError
     */
    public static studentLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students/logout',
        });
    }

    /**
     * @param questionId
     * @returns any Ok
     * @throws ApiError
     */
    public static studentGetQuestion(
        questionId: number,
    ): CancelablePromise<{
        question: Omit_Question_answer_;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/{questionId}',
            path: {
                'questionId': questionId,
            },
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static studentGetAllQuestions(): CancelablePromise<{
        questions: Array<Omit_Question_answer_>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/questions',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherSignup(
        requestBody: teacherSignupParams,
    ): CancelablePromise<{
        firstname: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherLogin(
        requestBody: teacherLoginParams,
    ): CancelablePromise<{
        firstname: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherGetUsername(): CancelablePromise<{
        firstname: any;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/me',
        });
    }

    /**
     * @returns profileParams Ok
     * @throws ApiError
     */
    public static teacherGetProfile(): CancelablePromise<profileParams> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/profile',
        });
    }

    /**
     * @param requestBody
     * @returns profileParams Ok
     * @throws ApiError
     */
    public static teacherUpdateProfile(
        requestBody: teacherProfileParams,
    ): CancelablePromise<profileParams> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/teachers/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any teacher logged out
     * @throws ApiError
     */
    public static teacherLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/logout',
        });
    }

    /**
     * @returns Question Ok
     * @throws ApiError
     */
    public static teacherGetAllQuestions(): CancelablePromise<Array<Question>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/questions',
        });
    }

    /**
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherCreateQuestion(
        requestBody: questionParams,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/questions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param teacherId
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherGetAllQuestionsOfTeacher(
        teacherId: number,
    ): CancelablePromise<{
        questions: Array<Omit_questionParams_answer_>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/{{teacherId}}/questions',
            query: {
                'teacherId': teacherId,
            },
        });
    }

    /**
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherGetAllMyQuestions(): CancelablePromise<{
        questions: Array<Question>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/teachers/questions/me',
        });
    }

    /**
     * @param questionId
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static teacherUpdateQuestion(
        questionId: number,
        requestBody: questionParams,
    ): CancelablePromise<{
        questionId: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/teachers/questions/{questionId}',
            path: {
                'questionId': questionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
