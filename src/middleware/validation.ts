import Joi from "joi";

export const quotationCreateSchema = Joi.object({
    name: Joi.string().required(),
    logo: Joi.string().required(),
    title: Joi.string().required(),
    quotationNumber: Joi.string().required(),
    quotationDate: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    totalAmount: Joi.string().required(),
    taxAmount: Joi.string().required(),
    accountNumber: Joi.string().required(),
    bankName: Joi.string().required(),
    termsAndConditions: Joi.string().required(),
    managerName: Joi.string().required(),
    signature: Joi.string().required(),
    managerPosition: Joi.string().required()
  });

  