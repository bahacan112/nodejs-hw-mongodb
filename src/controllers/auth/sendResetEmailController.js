import createHttpError from "http-errors";
import { sendResetEmail } from "../../services/email/sendResetEmail.js";
import { findUserByEmail } from "../../services/user/findUserByEmail.js";
import { generateResetToken } from "../../services/auth/generateResetToken.js";

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const token = generateResetToken(email);
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
