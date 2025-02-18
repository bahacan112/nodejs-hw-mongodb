import createError from "http-errors";
import User from "../db/models/User.js";
import bcrypt from "bcrypt";
import Session from "../db/models/Session.js";
import jwt from "jsonwebtoken";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email in use");

  const newUser = await User.create({ name, email, password });
  return { id: newUser._id, name: newUser.name, email: newUser.email };
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return next(createError(401, "Token is required"));
    }

    // Token geçerli mi?
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(createError(401, "Token is expired or invalid."));
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Şifreyi hashle ve güncelle
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Kullanıcının önceki oturumlarını sil
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
