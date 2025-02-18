/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../db/models/User.js";

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError(401, "Unauthorized: No token provided"));
    }

    const token = authorization.split(" ")[1]; // "Bearer TOKEN" -> TOKEN al

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(createError(401, "Unauthorized: User not found"));
    }

    req.user = user; // Kullanıcı bilgilerini req.user'a ekle
    next();
  } catch (error) {
    next(createError(401, "Unauthorized: Invalid token"));
  }
};

export default authenticate;
