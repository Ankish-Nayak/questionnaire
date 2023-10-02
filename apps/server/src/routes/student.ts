import express, { Request, Response } from "express";
import { studentLoginTypes, studentSignupTypes } from "types";
import { prisma } from "..";
import Cookies from "cookies";
export const router = express.Router();
import jwt from "jsonwebtoken";
import { authenticateJwt } from "../middlewares/auth";
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
          username: firstname,
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
router.get("/me", authenticateJwt, async (req: Request, res: Response) => {
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
  authenticateJwt,
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
  authenticateJwt,
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

// route for storing attempted questions
