"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotationCreateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.quotationCreateSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    logo: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    quotationNumber: joi_1.default.string().required(),
    quotationDate: joi_1.default.string().required(),
    invoiceNumber: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    totalAmount: joi_1.default.string().required(),
    taxAmount: joi_1.default.string().required(),
    accountNumber: joi_1.default.string().required(),
    bankName: joi_1.default.string().required(),
    termsAndConditions: joi_1.default.string().required(),
    managerName: joi_1.default.string().required(),
    signature: joi_1.default.string().required(),
    managerPosition: joi_1.default.string().required()
});
