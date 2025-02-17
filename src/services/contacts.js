import createError from "http-errors";
import Contact from "../db/models/Contact.js";
export const getAllContacts = async () => {
  console.log("📌 MongoDB'den veriler getiriliyor...");
  const contacts = await Contact.find();

  if (!contacts.length) {
    throw createError(404, "No contacts found.");
  }

  console.log("✅ Veriler başarıyla alındı!");
  return {
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  };
};

export const getContactById = async (contactId) => {
  try {
    console.log(`${contactId} ID ile kişi aranıyor...`);
    const contact = await Contact.findById(contactId);

    if (!contact) {
      throw createError(404, "Contact not found");
    }

    return {
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    };
  } catch (error) {
    console.error("Hata:", error.message);
    throw error; // Hata middleware tarafından yakalanacak
  }
};
export const createContact = async (contactData) => {
  const { name, phoneNumber, email, isFavourite, contactType } = contactData;

  // Zorunlu alanları kontrol et
  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      "Missing required fields: name, phoneNumber, or contactType"
    );
  }

  // Yeni kişi oluştur
  const newContact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite: isFavourite || false,
    contactType,
  });

  console.log("Yeni kişi eklendi:", newContact);

  return newContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    throw createError(404, "Contact not found");
  }

  return deletedContact;
};

export const patchContact = async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );

  if (!updatedContact) {
    throw createError(404, "Contact not found");
  }

  return updatedContact;
};
