import createError from "http-errors";

export const validateBody = (req, res, next) => {
  const { email, password, token } = req.body;

  if (req.path === "/send-reset-email" && !email) {
    return next(createError(400, "Email is required."));
  }

  if (req.path === "/reset-pwd" && (!token || !password)) {
    return next(createError(400, "Token and new password are required."));
  }

  next();
};
