import express from "express";
import cors from "cors";
import pino from "pino";
import router from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";

const logger = pino(); // Logger oluştur

export const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000", // Frontend'in URL'sini doğru girin
      credentials: true, // Çerezlerin gönderilmesini sağlar
    })
  );
  app.use(express.json());
  app.use(cookieParser()); // Çerezleri okumak için

  app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
  });
  app.use("/contacts", router);
  app.use("/auth", authRouter);
  app.use((req, res, next) => {
    console.log("📌 Cookies: ", req.cookies); // Gelen çerezleri konsola yazdır
    next();
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  // Sunucuyu başlat
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
};
