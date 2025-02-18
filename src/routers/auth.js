import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateBody.js";
import { sendResetEmail } from "../services/emailService.js";
import { resetPassword } from "../services/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/send-reset-email", validateBody, sendResetEmail);
router.post("/reset-pwd", validateBody, resetPassword);

export default router;
