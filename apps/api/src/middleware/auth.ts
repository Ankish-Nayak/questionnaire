import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// export const expressAuthentication = (
//   req: Request,
//   securityName: string,
//   scopes: string[]
// ): Promise<{ id: number; role: string }> => {
//   return new Promise((res, rej) => {
//     const secret = process.env.SECRET;
//     console.log(secret, securityName, scopes);
//     if (
//       scopes &&
//       scopes[0] === "student" &&
//       typeof req.cookies["student-token"] === "string" &&
//       typeof secret === "string"
//     ) {
//       const token: string = req.cookies["student-token"];
//       jwt.verify(token, secret, (err, user) => {
//         if (err) {
//           throw new ApiError("jwt", 403, "jwt error");
//         }
//         if (!user || typeof user === "string") {
//           throw new ApiError("student", 403, "student type error");
//         }
//         res({
//           id: user.id,
//           role: "student",
//         });
//       });
//     } else if (
//       scopes &&
//       scopes[0] === "teacher" &&
//       typeof req.cookies["teacher-token"] === "string" &&
//       typeof secret === "string"
//     ) {
//       const token: string = req.cookies["teacher-token"];
//       jwt.verify(token, secret, (err, user) => {
//         if (err) {
//           throw new ApiError("jwt", 403, "jwt error");
//         }
//         if (!user || typeof user === "string") {
//           throw new ApiError("teacher", 403, "teacher type error");
//         }
//         res({
//           id: user.id,
//           role: "teacher",
//         });
//       });
//     } else {
//       rej(new ApiError("authentication failed", 400));
//     }
//   });
// };

export const authenticateTeacherJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.SECRET;
  const cookies = new Cookies(req, res);
  const token = cookies.get("teacher-token");
  if (typeof token === "string" && typeof secret === "string") {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "jwt error" });
      }
      if (!user || typeof user === "string") {
        return res.status(403).json({ message: "type error" });
      }
      req.headers.teacherId = user.id;
      req.headers["role"] = "teacher";
    });
    next();
  } else {
    console.log("not have token");
    res.sendStatus(401);
    // res.redirect("/login");
  }
};

export const authenticateStudentJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.SECRET;
  const cookies = new Cookies(req, res);
  const token = cookies.get("student-token");
  if (typeof token === "string" && typeof secret === "string") {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "jwt error" });
      }
      if (!user || typeof user === "string") {
        return res.status(403).json({ message: "type error" });
      }
      req.headers.studentId = user.id;
      req.headers["role"] = "student";
    });
    next();
  } else {
    console.log("not have token");
    res.sendStatus(401);
  }
};
