import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim Zorunludur"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Telefon numarası Zorunludur"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ["work", "home", "personal"],
      default: "personal",
      required: [true, "İletişim türü zorunludur"],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");

export default Contact;
