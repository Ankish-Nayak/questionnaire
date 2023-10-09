"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileTypes = exports.answersTypes = exports.answerTypes = exports.questionTypes = exports.teacherLoginTypes = exports.studentLoginTypes = exports.studentSignupTypes = exports.teacherSignupTypes = void 0;
const zod_1 = require("zod");
exports.teacherSignupTypes = zod_1.z.object({
    firstname: zod_1.z.string().min(1),
    lastname: zod_1.z.string().min(1),
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.studentSignupTypes = zod_1.z.object({
    firstname: zod_1.z.string().min(1),
    lastname: zod_1.z.string().min(1),
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.studentLoginTypes = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.teacherLoginTypes = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.questionTypes = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().max(100),
    question: zod_1.z.string().min(1),
    option1: zod_1.z.string().min(1),
    option2: zod_1.z.string().min(1),
    option3: zod_1.z.string().min(1),
    option4: zod_1.z.string().min(1),
    answer: zod_1.z.string().min(1),
});
exports.answerTypes = zod_1.z.object({
    questionId: zod_1.z.number().min(1),
    answer: zod_1.z.string().min(1),
});
exports.answersTypes = zod_1.z.array(exports.answerTypes);
exports.profileTypes = zod_1.z.object({
    firstname: zod_1.z.string().min(1),
    lastname: zod_1.z.string().min(1),
    username: zod_1.z.string().email(),
});
