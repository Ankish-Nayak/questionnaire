import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
// passes request when both tokens are correct student and teacher
// export const authenticateJwt = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const cookie = new Cookies(req, res);
//   const secret: string = process.env.SECRET || "";
//   console.log(secret);
//   if (cookie.get("student-token") || cookie.get("teacher-token")) {
//     console.log("have token");
//     if (cookie.get("student-token")) {
//       const token: string = cookie.get("student-token") || "";
//       jwt.verify(token, secret, (err, user) => {
//         if (err) {
//           return res.status(403).json({ message: "jwt error" });
//         }
//         if (!user || typeof user === "string") {
//           return res.status(403).json({ message: "type error" });
//         }
//         req.headers["student"] = user.username;
//         req.headers["role"] = "student";
//       });
//     }
//     if (cookie.get("teacher-token")) {
//       const token: string = cookie.get("teacher-token") || "";
//       jwt.verify(token, secret, (err, user) => {
//         if (err) {
//           return res.status(403).json({ message: "jwt error" });
//         }
//         if (!user || typeof user === "string") {
//           return res.status(403).json({ message: "type error" });
//         }
//         req.headers["teacher"] = user.username;
//         req.headers["role"] = "teacher";
//       });
//     }
//     next();
//   } else {
//     console.log("not have token");
//     res.sendStatus(401);
//   }
// };

export const expressAuthentication = (
  req: Request,
  securityName: string,
  scopes?: string[]
): Promise<{ id: number; role: string }> => {
  return new Promise((res) => {
    const secret = process.env.SECRET;
    if (
      scopes &&
      scopes[0] === "student" &&
      typeof req.cookies["student-token"] === "string" &&
      typeof secret === "string"
    ) {
      const token: string = req.cookies["student-token"];
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          throw new ApiError("jwt", 403, "jwt error");
        }
        if (!user || typeof user === "string") {
          throw new ApiError("student", 403, "student type error");
        }
        res({
          id: user.id,
          role: "student",
        });
      });
    } else if (
      scopes &&
      scopes[0] === "teacher" &&
      typeof req.cookies["teacher-token"] === "string" &&
      typeof secret === "string"
    ) {
      const token: string = req.cookies["teacher-token"];
      jwt.verify(token, secret, (err, user) => {
        if (err) {
          throw new ApiError("jwt", 403, "jwt error");
        }
        if (!user || typeof user === "string") {
          throw new ApiError("teacher", 403, "teacher type error");
        }
        res({
          id: user.id,
          role: "teacher",
        });
      });
    }
  });
};

// export const authenticateTeacherJwt = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const cookie = new Cookies(req, res);
//   const token = cookie.get("teacher-token");
//   const secret = process.env.SECRET;
//   if (typeof token === "string" && typeof secret === "string") {
//     jwt.verify(token, secret, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: "jwt error" });
//       }
//       if (!user || typeof user === "string") {
//         return res.status(403).json({ message: "type error" });
//       }
//       req.headers["teacher"] = user.username;
//       req.headers["role"] = "teacher";
//     });
//     next();
//   } else {
//     console.log("not have token");
//     res.sendStatus(401);
//     // res.redirect("/login");
//   }
// };
