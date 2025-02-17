import express from "express";
import cors from "cors";
import pino from "pino";
import router from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const logger = pino(); // Logger oluştur

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`);
    next();
  });
  app.use("/contacts", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  // Sunucuyu başlat
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
};
