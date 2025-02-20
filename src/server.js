import express from "express";
import cors from "cors";
import pino from "pino";
import router from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import authRouter from "./routers/auth.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

const logger = pino(); // Logger oluştur

export const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://hw7-swagger-xrvk.onrender.com",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser()); // Çerezleri okumak için

  app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
  });

  // 📌 Swagger Dosyasını Okuma
  const swaggerFile = fs.readFileSync("./docs/openapi.yaml", "utf8");
  const swaggerDocument = YAML.parse(swaggerFile);

  // 📌 API Belgeleri için Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // API Yolları
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
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`); // 📌 Swagger adresi
  });

  return app;
};
