import createError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from "../services/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

/**
 * 📌 Tüm Kişileri Getir
 */
export const getContactsController = async (req, res, next) => {
  try {
    const response = await getAllContacts(req.user._id, req.query);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * 📌 ID'ye Göre Kişi Getir
 */
export const getContactByIdController = ctrlWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const response = await getContactById(contactId);

  if (!response) {
    return next(createError(404, "Contact not found"));
  }

  res.status(200).json(response);
});

/**
 * 📌 Yeni Kişi Ekle (Fotoğraf Yükleme Destekli)
 */
export const createContactController = ctrlWrapper(async (req, res, next) => {
  console.log("📩 İstek Gövdesi:", req.body);
  console.log("📷 Yüklenen Dosya:", req.file);

  const userId = req.user.id;
  const newContact = await createContact(userId, req.body, req.file);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
});

/**
 * 📌 Kişiyi Güncelle (Fotoğraf Güncelleme Destekli)
 */
export const patchContactController = ctrlWrapper(async (req, res, next) => {
  console.log("📩 Güncelleme İsteği:", req.body);
  console.log("📷 Yeni Yüklenen Dosya:", req.file);

  const { contactId } = req.params;
  const updatedContact = await patchContact(contactId, req.body, req.file);

  if (!updatedContact) {
    return next(createError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully updated the contact!",
    data: updatedContact,
  });
});

/**
 * 📌 Kişiyi Sil
 */
export const deleteContactController = ctrlWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    return next(createError(404, "Contact not found"));
  }

  res.status(204).send(); // 204 No Content
});
