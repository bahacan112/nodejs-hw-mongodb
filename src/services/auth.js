import createError from "http-errors";
import User from "../db/models/User";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email in use");

  const newUser = await User.create({ name, email, password });
  return { id: newUser._id, name: newUser.name, email: newUser.email };
};
