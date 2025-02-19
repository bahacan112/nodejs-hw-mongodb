import jwt from "jsonwebtoken";

export const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
};
