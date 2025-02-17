import { getAllContacts, getContactById } from "../services/contactServices.js";

export const getContactsController = async (req, res) => {
  try {
    const response = await getAllContacts();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
export const getContactsIdController = async (req, res) => {
  try {
    const { contactId } = req.params;
    console.log(contactId);
    const response = await getContactById(contactId);

    if (!response) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
