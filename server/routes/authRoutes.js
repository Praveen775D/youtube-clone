// server/routes/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuthUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;