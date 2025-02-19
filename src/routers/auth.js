import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";
import { sendResetEmail } from "../services/email/sendResetEmail.js";
import { resetPassword } from "../services/auth/resetPassword.js";
import { generateResetToken } from "../utils/tokenUtils.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/send-reset-email", async (req, res) => {
  try {
    console.log("📥 API'ye Gelen İstek:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "E-posta adresi gereklidir!" });
    }

    // 📌 Backend tarafında token oluştur
    const token = generateResetToken(email); // Yeni token oluştur
    console.log("🔑 Oluşturulan Token:", token);

    // 📌 Şifre sıfırlama e-postasını gönder
    const result = await sendResetEmail(email, token);

    if (result) {
      return res
        .status(200)
        .json({ message: "Şifre sıfırlama e-postası gönderildi!" });
    } else {
      return res.status(500).json({ message: "E-posta gönderme başarısız!" });
    }
  } catch (error) {
    console.error("❌ Sunucu hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    console.log("📥 API'ye Gelen İstek:", req.body);

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token ve yeni şifre gereklidir!" });
    }

    // 📌 Şifreyi sıfırlama servisini çağır
    const result = await resetPassword(token, newPassword);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Hata:", error);
    return res.status(error.status || 500).json({ message: error.message });
  }
});

export default router;
