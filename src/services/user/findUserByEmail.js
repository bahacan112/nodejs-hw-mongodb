import User from "../../db/models/User.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
