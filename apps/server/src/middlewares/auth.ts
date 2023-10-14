import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// passes request when both tokens are correct student and teacher
export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = new Cookies(req, res);
  const secret: string = process.env.SECRET || "";
  console.log(secret);
  if (cookie.get("student-token") || cookie.get("teacher-token")) {
    console.log("have token");
    if (cookie.get("student-token")) {
      const token: string = cookie.get("student-token") || "";
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "jwt error" });
        }
        if (!user || typeof user === "string") {
          return res.status(403).json({ message: "type error" });
        }
        req.headers["student"] = user.username;
        req.headers["role"] = "student";
      });
    }
    if (cookie.get("teacher-token")) {
      const token: string = cookie.get("teacher-token") || "";
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "jwt error" });
        }
        if (!user || typeof user === "string") {
          return res.status(403).json({ message: "type error" });
        }
        req.headers["teacher"] = user.username;
        req.headers["role"] = "teacher";
      });
    }
    next();
  } else {
    console.log("not have token");
    res.sendStatus(401);
  }
};

export const authenticateStudentJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = new Cookies(req, res);
  const token = cookie.get("student-token");
  const secret = process.env.SECRET;
  if (typeof token === "string" && typeof secret === "string") {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "jwt error" });
      }
      if (!user || typeof user === "string") {
        return res.status(403).json({ message: "type error" });
      }
      req.headers["student"] = user.username;
      req.headers["role"] = "student";
    });
    next();
  } else {
    console.log("not have token");
    // res.redirect("/login");
    res.sendStatus(401);
  }
};

export const authenticateTeacherJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = new Cookies(req, res);
  const token = cookie.get("teacher-token");
  const secret = process.env.SECRET;
  if (typeof token === "string" && typeof secret === "string") {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "jwt error" });
      }
      if (!user || typeof user === "string") {
        return res.status(403).json({ message: "type error" });
      }
      req.headers["teacher"] = user.username;
      req.headers["role"] = "teacher";
    });
    next();
  } else {
    console.log("not have token");
    res.sendStatus(401);
    // res.redirect("/login");
  }
};
