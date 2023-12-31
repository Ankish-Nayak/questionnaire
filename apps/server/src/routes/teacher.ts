import express, { Request, Response } from "express";
import {
  profileParams,
  profileTypes,
  questionParams,
  questionTypes,
  teacherLoginTypes,
  teacherSignupTypes,
} from "types";
import { prisma } from "..";
export const router = express.Router();
import * as jwt from "jsonwebtoken";
import * as Cookies from "cookies";
import { authenticateTeacherJwt } from "../middlewares/auth";
import dotenv from "dotenv";
dotenv.config();
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
      const cookies = new Cookies.default(req, res);
      cookies.set("teacher-token", token);
      const newTeacher = await prisma.teacher.create({
        data: {
          firstname,
          lastname,
          username,
          password,
        },
      });
      res.json({ message: "Teacher created successfully", firstname });
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
      const cookie = new Cookies.default(req, res);
      cookie.set("teacher-token", token);
      res.json({
        message: "Teacher loggedIn successfully",
        firstname: teacher.firstname,
      });
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
  authenticateTeacherJwt,
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
            res.json({
              message: "Question created",
              questionId: newQuestion.id,
            });
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
  authenticateTeacherJwt,
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
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    // console.log(req.headers['teacher']);
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      console.log(",", username);
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
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
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
  "/:teacherId/questions",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
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

// me route
router.get(
  "/me",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        if (teacher) {
          res.json({ firstname: teacher.firstname });
        } else {
          res.status(403).json({ message: "Teacher dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Teacher does not exists" });
    }
  }
);

// get particular question
router.get(
  "/questions/:questionId",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        const questionId = parseInt(req.params.questionId);
        if (teacher) {
          const question = await prisma.question.findUnique({
            where: {
              id: questionId,
            },
          });
          if (question) {
            res.json({ question });
          } else {
            res.status(403).json({ message: "Question dose not exists" });
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

// fetch teacher profile
router.get(
  "/profile",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        if (teacher) {
          res.json({
            firstname: teacher.firstname,
            lastname: teacher.lastname,
            createdAt: teacher.createdAt,
            username: teacher.username,
          });
        } else {
          res.status(403).json({ message: "Student dose not exists" });
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

// update teacher profile
router.put(
  "/profile",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      const parsedInputs = profileTypes.safeParse(req.body);
      if (!parsedInputs.success) {
        return res.status(411).json({ error: parsedInputs.error });
      }
      const data: profileParams = parsedInputs.data;
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        if (teacher) {
          const existingTeacher = await prisma.teacher.findUnique({
            where: { username: data.username },
          });
          if (existingTeacher && existingTeacher.id !== teacher.id) {
            res.status(411).json({ message: "username taken" });
          } else {
            const updatedTeacher = await prisma.teacher.update({
              where: { id: teacher.id },
              data: {
                ...data,
              },
            });
            if (updatedTeacher) {
              const token: string = jwt.sign(
                { username: updatedTeacher.username, role: "teacher" },
                secret,
                { expiresIn: "1h" }
              );
              const cookie = new Cookies.default(req, res);
              cookie.set("teacher-token", token);
              res.json({
                message: "Updated successfully",
                firstname: updatedTeacher.firstname,
              });
            } else {
              res.status(403).json({ message: "Failed to update" });
            }
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

// logout router
router.post(
  "/logout",
  authenticateTeacherJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["teacher"] === "string") {
      const username: string = req.headers["teacher"];
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { username },
        });
        if (teacher) {
          const cookie = new Cookies.default(req, res);
          cookie.set("teacher-token", null);
          res.json({ message: "Teacher logout successfully" });
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
