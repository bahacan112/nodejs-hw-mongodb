const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error); // Hata olursa errorHandler middleware'ine yönlendir
    }
  };
};

export default ctrlWrapper;
