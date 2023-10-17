import jwt from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";

export const generateToken = (id: number, role: string) => {
  if (typeof process.env.SECRET !== "string") {
    throw new ApiError("env error", 403, "invalid secrets");
  }
  const secret: string = process.env.SECRET;
  return jwt.sign({ id, role }, secret, {
    expiresIn: "1h",
  });
};
