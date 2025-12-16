import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/authRoutes.js";
import movieRoutes from "../routes/movieRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check routes ---
app.get("/", (req, res) => res.json({ status: "working", message: "API is running" }));
app.get("/api", (req, res) => res.json({ status: "working", message: "API routes ready" }));

// --- Mount routers ---
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
    availableRoutes: [
      "GET /",
      "GET /api",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/profile",
      "POST /api/movies/add",
      "GET /api/movies/library",
      "PUT /api/movies/:movieId/rating",
      "DELETE /api/movies/:movieId"
    ]
  });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ success: false, error: err.message || "Internal server error" });
});

export default app;
