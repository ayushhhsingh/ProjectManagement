import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// BASIC CONFIGURATION

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// CORS CONFIGURATION
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Content-Length"], // changed
  })
);

// ROUTES
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/healthcheck", healthCheckRoutes);

// changed:
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/instagram", (req, res) => {
  res.send("this is instagram page");
});

export default app;
