import express, { Request, Response } from "express";
import {
  answerParams,
  answersTypes,
  profileParams,
  profileTypes,
  studentLoginTypes,
  studentSignupTypes,
} from "types";
import { prisma } from "..";
import Cookies from "cookies";
export const router = express.Router();
import jwt from "jsonwebtoken";
import { authenticateStudentJwt } from "../middlewares/auth";
const secret: string = process.env.SECRET || "";
console.log(secret);

// signup route
router.post("/signup", async (req: Request, res: Response) => {
  const parsedInput = studentSignupTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { firstname, lastname, username, password } = parsedInput.data;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { username, password },
    });
    if (teacher) {
      res.status(403).json({ message: "Student already exists" });
    } else {
      const newTeacher = await prisma.student.create({
        data: {
          firstname,
          lastname,
          username,
          password,
        },
      });
      if (newTeacher) {
        const cookie = new Cookies(req, res);
        const token = jwt.sign({ username, role: "student" }, secret, {
          expiresIn: "1h",
        });
        cookie.set("student-token", token);
        res.json({
          message: "Student registered successfully",
          firstname: firstname,
        });
      } else {
        res.status(403).json({ message: "Failed to register" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
});

// login route
router.post("/login", async (req: Request, res: Response) => {
  const parsedInput = studentLoginTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { username, password } = parsedInput.data;
  try {
    const student = await prisma.student.findUnique({
      where: { username, password },
    });
    if (student) {
      const token = jwt.sign({ username, role: "student" }, secret, {
        expiresIn: "1h",
      });
      const cookie = new Cookies(req, res);
      cookie.set("student-token", token);
      res.json({
        message: "Student logged in successfully",
        firstname: student.firstname,
      });
    } else {
      res.status(403).json({ message: "Student dose not exists" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
});

// me route
router.get("/me", authenticateStudentJwt, async (req: Request, res: Response) => {
  if (typeof req.headers["student"] === "string") {
    const username: string = req.headers["student"];
    try {
      const student = await prisma.student.findUnique({ where: { username } });
      if (student) {
        res.json({ firstname: student.firstname });
      } else {
        res.status(403).json({ message: "Student dose not exists" });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "db error" });
    }
  } else {
    res.status(403).json({ message: "Student dose not exists" });
  }
});

// get all questions
router.get(
  "/questions",
  authenticateStudentJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["student"] === "string") {
      const username: string = req.headers["student"];
      try {
        const student = await prisma.student.findUnique({
          where: { username },
        });
        if (student) {
          const questions = await prisma.question.findMany({});
          res.json({ questions });
        } else {
          res.status(403).json({ message: "Student dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Student dose not exists" });
    }
  }
);

// route for getting particular question
router.get(
  "/questions/:questionId",
  authenticateStudentJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["student"] === "string") {
      const username: string = req.headers["student"];
      const questionId = parseInt(req.params.questionId);
      try {
        const student = await prisma.student.findUnique({
          where: { username },
        });
        if (student) {
          const question = await prisma.question.findUnique({
            where: { id: questionId },
          });
          if (question) {
            res.json({ question });
          } else {
            res.status(403).json({ message: "Question dose not exists" });
          }
        } else {
          res.status(403).json({ message: "Student dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
      res.status(403).json({ message: "Student dose not exists" });
    }
  }
);

// route for fetching profile
router.get("/profile", authenticateStudentJwt, async (req: Request, res: Response) => {
  if (typeof req.headers["student"] === "string") {
    const username: string = req.headers["student"];
    try {
      const student = await prisma.student.findUnique({
        where: { username },
      });
      if (student) {
        res.json({
          firstname: student.firstname,
          lastname: student.lastname,
          createdAt: student.createdAt,
          username: student.username,
        });
      } else {
        res.status(403).json({ message: "student dose not exists" });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "db error" });
    }
  } else {
    res.status(403).json({ message: "student dose not exists" });
  }
});

// route for updating profile

router.put("/profile", authenticateStudentJwt, async (req: Request, res: Response) => {
  if (typeof req.headers["student"] === "string") {
    const username: string = req.headers["student"];
    const parsedInputs = profileTypes.safeParse(req.body);
    if (!parsedInputs.success) {
      return res.status(411).json({ error: parsedInputs.error });
    }
    try {
      const student = await prisma.student.findUnique({ where: { username } });
      if (student) {
        const data: profileParams = parsedInputs.data;
        const existingStudent = await prisma.student.findUnique({
          where: { username: data.username },
        });
        if (existingStudent && existingStudent.id !== student.id) {
          res.status(411).json({ message: "username taken" });
        } else {
          const updatedStudent = await prisma.student.update({
            where: { id: student.id },
            data: {
              ...data,
            },
          });
          if (updatedStudent) {
            const token: string = jwt.sign(
              { username: updatedStudent.username, role: "student" },
              secret,
              { expiresIn: "1h" }
            );
            const cookies = new Cookies(req, res);
            cookies.set("student-token", token);
            res.json({
              message: "updated successfully",
              firstname: updatedStudent.firstname,
            });
          } else {
            res.status(403).json({ message: "Failed to update" });
          }
        }
      }
    } catch (e) {
      res.status(404).json({ message: "db error" });
    }
  } else {
    res.status(403).json({ message: "Student dose not exists" });
  }
});

// attempted question route
router.post(
  `/attempt`,
  authenticateStudentJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["student"] === "string") {
      const username: string = req.headers["student"];
      try {
        const student = await prisma.student.findUnique({
          where: { username },
        });
        if (student) {
          const parsedInputs = answersTypes.safeParse(req.body);
          if (!parsedInputs.success) {
            return res.status(411).json({ error: parsedInputs.error });
          }
          const attempts: { questionId: number; answer: string }[] =
            parsedInputs.data;
          const answers: answerParams[] = [];

          const promises = attempts.map(
            async ({ questionId, answer }): Promise<void> => {
              // const updatedStudent = await prisma.student.update({
              //   where: {
              //     username,
              //   },
              //   data: {
              //     attempts: {
              //       create: [
              //         {
              //           answer: answer,
              //           question: {
              //             connect: {
              //               id: questionId,
              //             },
              //           },
              //         },
              //       ],
              //     },
              //   },
              // });
              // if (!updatedStudent) {
              //   res.status(403).json({ message: "Failed to updated" });
              // }
              return new Promise(async (resolve, rej) => {
                const question = await prisma.question.findUnique({
                  where: { id: questionId },
                });
                if (question) {
                  answers.push({
                    questionId,
                    answer: question.answer,
                  });
                } else {
                  res.status(403).json({ message: "Failed to check" });
                }
                resolve();
              });
            }
          );
          Promise.all(promises).then(() => {
            console.log(answers);
            res.json({ message: "success", answers });
          });
        } else {
          res.status(403).json({ message: "Student dose not exists" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
    } else {
    }
  }
);

router.post("/logout", authenticateStudentJwt, async (req: Request, res: Response) => {
  if (typeof req.headers["student"] === "string") {
    const username = req.headers["student"];
    try {
      const student = await prisma.student.findUnique({ where: { username } });
      if (student) {
        const cookie = new Cookies(req, res);
        cookie.set("student-token", null);
        res.json({ message: "Student logged out" });
      } else {
        res.status(403).json({ message: "Student dose not exists" });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: "db error" });
    }
  } else {
    res.status(403).json({ message: "student dose not exists" });
  }
});
