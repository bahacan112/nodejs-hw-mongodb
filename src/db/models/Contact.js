import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      required: true,
      default: "personal",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Kullanıcı bağlantısı
    photo: { type: String, required: false }, // 📌 Cloudinary'den gelen fotoğraf URL'si
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");

export default Contact;
