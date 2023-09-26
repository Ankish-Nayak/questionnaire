import express from "express";
import cors from "cors";
import { router as teacherRouter } from "./routes/teacher";
import { router as studentRouter } from "./routes/student";
import path from "path";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);
app.use(express.static("public"));
app.use("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running at 3000");
});
