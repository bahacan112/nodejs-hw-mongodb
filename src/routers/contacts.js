import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from "../controllers/contactsController.js";

const router = express.Router();

router.get("/", getContactsController);

router.get("/:contactId", getContactByIdController);

router.post("/", createContactController);

router.delete("/:contactId", deleteContactController);
router.patch("/:contactId", patchContactController);

export default router;
