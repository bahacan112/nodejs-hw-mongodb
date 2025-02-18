import createError from "http-errors";

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(createError(400, `Validation error: ${errorMessage}`));
    }

    next();
  };
};

export default validateBody;
