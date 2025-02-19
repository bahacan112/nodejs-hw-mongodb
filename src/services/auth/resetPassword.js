import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { findUserByEmail } from "../user/findUserByEmail.js";

export const resetPassword = async (token, newPassword) => {
  try {
    // 📌 Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 📌 Kullanıcıyı veritabanında ara
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      throw createHttpError(404, "Kullanıcı bulunamadı!");
    }

    // 📌 Şifreyi hash'leyip kaydet
    user.password = newPassword;
    await user.save();

    console.log(`✅ ${user.email} için yeni şifre başarıyla kaydedildi!`);
    return { message: "Şifre başarıyla güncellendi!" };
  } catch (error) {
    console.error("❌ Şifre sıfırlama hatası:", error);

    if (error.name === "TokenExpiredError") {
      throw createHttpError(401, "Token süresi dolmuş!");
    }
    if (error.name === "JsonWebTokenError") {
      throw createHttpError(401, "Geçersiz token!");
    }
    throw createHttpError(500, "Şifre sıfırlama sırasında bir hata oluştu.");
  }
};
