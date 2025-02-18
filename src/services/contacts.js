import createError from "http-errors";
import Contact from "../db/models/Contact.js";
export const getAllContacts = async (userId, queryParams) => {
  let {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
  } = queryParams;

  // Sayısal değerlere çevir
  page = parseInt(page);
  perPage = parseInt(perPage);

  // Sayfalama ve sıralama için ayarlar
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  // Kullanıcının sadece kendi eklediği kişileri getirmesi
  const totalItems = await Contact.countDocuments({ userId });
  const contacts = await Contact.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  return {
    status: 200,
    message: "Successfully found contacts!",
    data: {
      contacts, // Çift veri yapısını önledik
      page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      hasPreviousPage: page > 1,
      hasNextPage: page * perPage < totalItems,
    },
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
export const createContact = async (userId, contactData) => {
  const { name, phoneNumber, email, isFavourite, contactType } = contactData;

  // 🛑 Zorunlu alanları kontrol et
  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      "Missing required fields: name, phoneNumber, or contactType"
    );
  }

  // ✅ Yeni kişi oluştururken userId ekleyelim
  const newContact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite: isFavourite || false,
    contactType,
    userId, // 🛑 Kullanıcı ID ekleniyor!
  });

  return newContact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw createError(404, "Contact not found");
  }

  return contact;
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
