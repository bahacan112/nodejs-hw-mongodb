import pkg from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const cloudinary = pkg.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "contacts", // 📂 Cloudinary'de "contacts" klasörüne kaydedilecek
    });
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary yükleme hatası:", error);
    throw new Error("Image upload failed");
  }
};
