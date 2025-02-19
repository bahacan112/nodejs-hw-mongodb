import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// 📌 Cloudinary depolama ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "contacts", // 📂 Cloudinary içinde "contacts" klasörüne kaydedilecek
    format: async (req, file) => "jpeg", // 📷 Dosya formatı (jpeg)
    public_id: (req, file) => file.originalname.split(".")[0], // 🆔 Orijinal dosya adını kullan
  },
});

// 📌 Multer ile dosya yükleme middleware'ı oluştur
const upload = multer({ storage });

export default upload;
