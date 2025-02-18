import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from "../controllers/contactsController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// 🛑 Tek tek middleware ekleyerek daha okunaklı hale getirelim

// 🔹 Tüm kişileri listeleme (Sadece giriş yapmış kullanıcılar erişebilir)
router.get("/", authenticate, getContactsController);

// 🔹 Belirli bir kişiyi ID ile alma (Sadece giriş yapmış kullanıcılar erişebilir)
router.get("/:contactId", authenticate, getContactByIdController);

// 🔹 Yeni kişi ekleme (Sadece giriş yapmış kullanıcılar erişebilir)
router.post("/", authenticate, createContactController);

// 🔹 Kişiyi güncelleme (Sadece giriş yapmış kullanıcılar erişebilir)
router.patch("/:contactId", authenticate, patchContactController);

// 🔹 Kişiyi silme (Sadece giriş yapmış kullanıcılar erişebilir)
router.delete("/:contactId", authenticate, deleteContactController);

export default router;
