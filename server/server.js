// server/server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";

/*  CONFIG   */
dotenv.config();
connectDB();

const app = express();

/*   CREATE FOLDERS   */
//  Ensure upload directories exist 
const createFolders = () => {
  const dirs = [
    "uploads",
    "uploads/videos",
    "uploads/thumbnails",
    "uploads/avatars",   
    "uploads/banners",   
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createFolders();

/*   MIDDLEWARE   */
app.use(morgan("dev"));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://youtube-clone-mu-bay-69.vercel.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*  This is required for serving static files */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/*   ROUTES   */
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);

/*   HEALTH   */
app.get("/", (req, res) => {
  res.send(" API running...");
});

/*   ERROR   */
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

/*   START   */
// Use environment variable for port or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
