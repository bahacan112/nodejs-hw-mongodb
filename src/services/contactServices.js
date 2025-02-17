import Contact from "../db/models/Contact.js";

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // MongoDB'deki tüm kişileri getir
    return {
      status: 200,
      message: "Kişi bulundu!",
      data: contacts,
    };
  } catch (error) {
    throw new Error("Kişi bulunamadı: " + error.message);
  }
};
export const getContactById = async (contactId) => {
  try {
    console.log("MongoDB'den ${contactId} ID'li kişi getiriliyor...");
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return null;
    }

    console.log(`${contactId} ID'li kişi bulundu`);
    return {
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    };
  } catch (error) {
    console.log("hata", error.message);
    throw new Error(`Kişi Bulunamadı:${error.message}`);
  }
};
