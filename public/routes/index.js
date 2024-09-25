"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("../utils/client"));
const Upload_1 = __importDefault(require("../utils/Upload"));
const router = express_1.default.Router();
router
    .route("/")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ data: "welcome to quotation api", message: "success" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router
    .route("/quotation")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let quotations = yield client_1.default.quotation.findFirst({
            include: {
                company: true,
            },
        });
        res.status(200).json({ data: quotations, message: "success" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}))
    .post((0, Upload_1.default)([
    { name: "logo", maxCount: 1 },
    { name: "managerSignature", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        let _j = req.body, { name, manager, phoneNumber, taxAmount, totalAmount, quotationServices } = _j, rest = __rest(_j, ["name", "manager", "phoneNumber", "taxAmount", "totalAmount", "quotationServices"]);
        let sum = 0;
        if (!name || !manager || !phoneNumber || !taxAmount || !totalAmount || !quotationServices) {
            return res.status(400).json({ error: "All fields are required" });
        }
        let quotationService = JSON.parse(quotationServices);
        if (quotationService && quotationService.length > 0) {
            quotationService.map((item) => {
                sum = sum + (Number(item.hours) * Number(item.price));
            });
            // sum = sum - Number(taxAmount);
            if (sum < 0) {
                throw new Error("Tax amount shouldnot be greater then total amount");
            }
        }
        let logo = req.files && ((_a = req.files) === null || _a === void 0 ? void 0 : _a.logo) ? (_d = (_c = (_b = req.files) === null || _b === void 0 ? void 0 : _b.logo) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename : "";
        let managerSignature = req.files && ((_e = req.files) === null || _e === void 0 ? void 0 : _e.managerSignature) ? (_h = (_g = (_f = req.files) === null || _f === void 0 ? void 0 : _f.managerSignature) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.filename : "";
        let company = yield client_1.default.company.findFirst();
        let quotation = yield client_1.default.quotation.findFirst();
        let companyData = {
            name,
            logo,
            manager,
            managerSignature,
            phoneNumber,
        };
        if (company && quotation) {
            yield client_1.default.company.update({
                where: {
                    id: company.id,
                },
                data: companyData,
            });
            yield client_1.default.quotation.update({
                where: {
                    id: quotation.id,
                },
                data: Object.assign(Object.assign({}, rest), { companyId: company.id, taxAmount: Number(taxAmount), totalAmount: Number(sum), quotationServices: quotationServices }),
            });
        }
        else {
            let newCompany = yield client_1.default.company.create({
                data: {
                    name,
                    logo,
                    manager,
                    managerSignature,
                    phoneNumber,
                },
            });
            yield client_1.default.quotation.create({
                data: Object.assign(Object.assign({}, rest), { companyId: newCompany.id, taxAmount: Number(taxAmount), totalAmount: Number(sum), quotationServices: quotationServices }),
            });
        }
        let quotationData = yield client_1.default.quotation.findFirst({
            include: {
                company: true,
            },
        });
        res.status(200).json({ data: { quotationData }, message: "success" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
