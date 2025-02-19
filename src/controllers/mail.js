import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { sendResetEmail } from "../services/emailService.js";
import User from "../models/User.js";

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Kullanıcının var olup olmadığını kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    // Token oluştur (5 dakika geçerli)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // Brevo ile e-posta gönder
    await sendResetEmail(email, token);

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
