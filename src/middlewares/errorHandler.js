const errorHandler = (err, req, res) => {
  console.error("Hata:", err.message);

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: "Something went wrong",
    data: err.message || "Internal Server Error",
  });
};

export default errorHandler;
