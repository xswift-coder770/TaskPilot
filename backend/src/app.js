import express from "express";
import config from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser"
import path from "path";

const app = express();

//cors configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//basic express configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/images", express.static(path.resolve("public/images")));
app.use(cookieParser());

//import the routes
import healthCheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.route.js"
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import noteRouter from "./routes/note.route.js";

//mounting routes
app.use("/api/v1/healthcheck/",healthCheckRouter);
app.use("/api/v1/auth/",authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Welcome to TaskPilot");
});

export default app;
