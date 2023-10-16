import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from 'api-error-handler';
export const app = express();
export const prisma = new PrismaClient();

app.use(errorHandler());
// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

RegisterRoutes(app);
