import express from "express";
import cors from "cors";
import pino from "pino";
import {
  getContactsController,
  getContactsIdController,
} from "./controllers/contactsController.js";
const logger = pino(); // Logger oluştur

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  app.get("/contacts", getContactsController);
  app.get("/contacts/:contactId", getContactsIdController);
  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  // Sunucuyu başlat
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
