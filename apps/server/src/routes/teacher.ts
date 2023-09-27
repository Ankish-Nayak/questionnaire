import express, { Request, Response } from "express";
import {
  questionParams,
  questionTypes,
  teacherLoginTypes,
  teacherSignupTypes,
} from "types";
import { prisma } from "..";
export const router = express.Router();
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { authenticateJwt } from "../middlewares/auth";
const secret: string = process.env.SECRET || "";
// signup route
router.post("/signup", async (req: Request, res: Response) => {
  const parsedInput = teacherSignupTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({ error: parsedInput.error });
  }
  const { firstname, lastname, username, password } = parsedInput.data;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { username, password },
    });
    if (teacher) {
      res.status(403).json({ message: "Teacher already exists" });
    } else {
      const token: string = jwt.sign({ username, role: "teacher" }, secret, {
        expiresIn: "1h",
      });
      const cookies = new Cookies(req, res);
      cookies.set("teacher-token", token);
      const newTeacher = await prisma.teacher.create({
        data: {
          firstname,
          lastname,
          username,
          password,
        },
      });
      res.json({ message: "Teacher created successfully", token });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
});

//login route
router.post("/login", async (req: Request, res: Response) => {
  const parsedInput = teacherLoginTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { username, password } = parsedInput.data;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { username, password },
    });
    if (teacher) {
      const token: string = jwt.sign({ username, role: "teacher" }, secret, {
        expiresIn: "1h",
      });
      const cookie = new Cookies(req, res);
      cookie.set("teacher-token", token);
      res.json({ message: "Teacher loggedIn successfully", token });
    } else {
      res.status(403).json({ message: "Teacher dose not exists" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
});
// create new question route
router.post(
  "/questions",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const parsedInput = questionTypes.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ error: parsedInput.error });
    }
    if (typeof req.headers["teacher"] === "string") {
      const questionData: questionParams = parsedInput.data;
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        if (teacher) {
          const question = await prisma.question.findUnique({
            where: {
              question: questionData.question,
            },
          });
          if (question) {
            res.status(403).json({ message: "Change title of question" });
          } else {
            const newQuestion = await prisma.question.create({
              data: {
                creatorId: teacher.id,
                ...questionData,
              },
            });
            res.json(200).json({ message: "Question created" });
          }
        } else {
          res.status(403).json({ message: "Teacher not found" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(404).json({ message: "Teacher does not exists" });
    }
  }
);
// update question route
router.put(
  "/questions/:questionId",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const parsedInput = questionTypes.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ error: parsedInput.error });
    }
    if (typeof req.headers["teacher"] === "string") {
      const questionData: questionParams = parsedInput.data;
      const questionId = parseInt(req.params.questionId);
      const username: string = req.headers["teacher"] || "";
      try {
        const teacher = await prisma.teacher.findUnique({
          where: {
            username,
          },
        });
        if (teacher) {
          const updatedQuestion = await prisma.question.update({
            where: {
              id: questionId,
            },
            data: {
              ...questionData,
            },
          });
          if (updatedQuestion) {
            res.json({ message: "Question upated", questionId });
          } else {
            res.status(403).json({ message: "Failed to updated question" });
          }
        } else {
          res.status(403).json({ message: "Teacher dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Teacher dose not exists" });
    }
  }
);

// get all questions from all teachers
router.get(
  "/questions",
  authenticateJwt,
  async (req: Request, res: Response) => {
    if (req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: {
            username,
          },
        });
        if (teacher) {
          const questions = await prisma.question.findMany({});
          res.json({ questions });
        } else {
          return res.status(403).json({ message: "Teacher dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Teacher dose not exists" });
    }
  }
);

// get questions from logged in teacher
router.get(
  "/questions/me",
  authenticateJwt,
  async (req: Request, res: Response) => {
    if (req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: {
            username,
          },
          include: {
            questions: true,
          },
        });
        if (teacher) {
          res.json({ questions: teacher.questions });
        } else {
          return res.status(403).json({ message: "Teacher dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Teacher dose not exists" });
    }
  }
);

// get questions from particular given id teacher
router.get(
  "/questions/:teacherId",
  authenticateJwt,
  async (req: Request, res: Response) => {
    if (req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      const teacherId = parseInt(req.params.teacherId);
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { id: teacherId },
          include: { questions: true },
        });
        if (teacher) {
          res.json({ questions: teacher.questions });
        } else {
          res.status(403).json({ message: "Teacher dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Teacher dose not exists" });
    }
  }
);

