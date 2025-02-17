import createError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact, // ✅ deleteContact servisinin var olduğundan emin ol
} from "../services/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

export const getContactsController = ctrlWrapper(async (req, res) => {
  const response = await getAllContacts();
  res.status(200).json(response);
});

export const getContactByIdController = ctrlWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const response = await getContactById(contactId);

  if (!response) {
    return next(createError(404, "Contact not found"));
  }

  res.status(200).json(response);
});

export const createContactController = ctrlWrapper(async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
});

// 📌 PATCH (Güncelleme) Kontrolörü
export const patchContactController = ctrlWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await patchContact(contactId, req.body);

  if (!updatedContact) {
    return next(createError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact,
  });
});

// 📌 DELETE (Silme) Kontrolörü
export const deleteContactController = ctrlWrapper(async (req, res, next) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    return next(createError(404, "Contact not found"));
  }

  res.status(204).send(); // 204 No Content
});
