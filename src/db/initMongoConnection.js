import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

// Eksik değişkenleri kontrol et
if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
  console.error(".env dosyan eksik!");
  process.exit(1);
}

// **Doğru MongoDB bağlantı URI'si oluştur**
const MONGO_URI = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(
  MONGODB_PASSWORD
)}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

export const initMongoConnection = async () => {
  try {
    console.log("MongoDB'ye bağlanıyor...");
    await mongoose.connect(MONGO_URI);
    console.log("Mongo bağlantısı başarılı!");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error.message);
    process.exit(1);
  }
};
