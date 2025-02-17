const errorHandler = (err, req, res, next) => {
  console.error("🔥 Hata:", err.message);

  // Express varsayılan HTML hata sayfasını göstermemesi için JSON döndürmeliyiz
  if (res.headersSent) {
    return next(err);
  }

  // Hata kodu ve mesajı belirle
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";

  // 📌 Yanıtı JSON formatında döndür
  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};

export default errorHandler;
