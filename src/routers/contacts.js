import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from "../controllers/contactsController.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js"; // 📌 Multer ile dosya yükleme middleware'i

const router = express.Router();

// 🔹 Tüm kişileri listeleme (Sadece giriş yapmış kullanıcılar erişebilir)
router.get("/", authenticate, getContactsController);

// 🔹 Belirli bir kişiyi ID ile alma (Sadece giriş yapmış kullanıcılar erişebilir)
router.get("/:contactId", authenticate, getContactByIdController);

// 🔹 Yeni kişi ekleme (JSON + Fotoğraf Yükleme Destekli)
router.post("/", authenticate, upload.single("photo"), createContactController);

// 🔹 Kişiyi güncelleme (JSON + Fotoğraf Güncelleme Destekli)
router.patch(
  "/:contactId",
  authenticate,
  upload.single("photo"),
  patchContactController
);

// 🔹 Kişiyi silme (Sadece giriş yapmış kullanıcılar erişebilir)
router.delete("/:contactId", authenticate, deleteContactController);

export default router;
