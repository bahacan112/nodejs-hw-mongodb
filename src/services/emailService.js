import { Resend } from "resend";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../db/models/User.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // 5 dakika geçerli token oluştur
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Şifre sıfırlama linkini oluştur
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // **Resend ile e-posta gönder**
    const response = await resend.emails.send({
      from: "noreply@yourdomain.com", // Resend'de doğrulanan alan adı olmalı
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <h1>Şifre Sıfırlama</h1>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetLink}" target="_blank">Şifreyi Sıfırla</a>
        <p>Bu bağlantı 5 dakika içinde geçerliliğini yitirecektir.</p>
      `,
    });

    if (!response.id) {
      return next(
        createError(500, "Failed to send the email, please try again later.")
      );
    }

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
