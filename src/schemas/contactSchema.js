import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("work", "home", "personal").required(),
  photo: Joi.string().uri().optional(), // 📌 Fotoğraf URL'si için Joi validation eklendi
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid("work", "home", "personal").optional(),
  photo: Joi.string().uri().optional(), // 📌 Güncelleme sırasında fotoğraf eklenebilir
}).min(1); // Güncelleme için en az bir alan zorunlu!
