import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

const startServer = async () => {
  try {
    await initMongoConnection(); // Önce MongoDB bağlantısını kur
    setupServer(); // Sonra sunucuyu başlat
  } catch (error) {
    console.error("Uygulama başlatılamadı:", error.message);
  }
};

startServer();
