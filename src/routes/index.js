import express from "express";
import prisma from "../utils/client.js";
import uploadMiddleware from "../utils/Upload.js";

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      res.status(200).json({ data: "welcome to quotation api", message: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router
  .route("/quotation")
  .get(async (req, res) => {
    try {
      let quotations = await prisma.quotation.findFirst({
        include: {
          company: true,
        },
      });
      res.status(200).json({ data: quotations, message: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(
    uploadMiddleware([
      { name: "logo", maxCount: 1 },
      { name: "managerSignature", maxCount: 1 },
    ]),
    async (req, res) => {
      try {


        let { name, manager, phoneNumber, taxAmount, totalAmount, quotationServices, ...rest } = req.body;
        let sum = 0;

        if (!name || !manager || !phoneNumber || !taxAmount || !totalAmount || !quotationServices) {
          return res.status(400).json({ error: "All fields are required" });
        }

        let quotationService = JSON.parse(quotationServices);
        if (quotationService && quotationService.length > 0) {
          quotationService.map((item) => {
            let unitPrice = Number(item.price) * Number(item.hours);
            sum = isNaN(unitPrice) ? Number(sum) + 0 : Number(sum) + unitPrice;
          });
          if (sum < 0) {
            throw new Error("Tax amount should not be greater than total amount");
          }
        }

        let logo = req.files && req.files.logo ? req.files.logo[0].filename : "";
        let managerSignature = req.files && req.files.managerSignature ? req.files.managerSignature[0].filename : "";

        let company = await prisma.company.findFirst();
        let quotation = await prisma.quotation.findFirst();

        let companyData = {
          name,
          logo,
          manager,
          managerSignature,
          phoneNumber,
        };

        if (company && quotation) {
          await prisma.company.update({
            where: { id: company.id },
            data: companyData,
          });
          console.log("companyData", company);
          await prisma.quotation.update({
            where: { id: quotation.id },
            data: {
              ...rest,
              companyId: company?.id,
              taxAmount: Number(taxAmount),
              totalAmount: Number(sum.toFixed(2)),
              quotationServices: quotationServices,
            },
          });
        } else {
          let newCompany = await prisma.company.create({
            data: {
              name,
              logo,
              manager,
              managerSignature,
              phoneNumber,
            },
          });

          await prisma.quotation.create({
            data: {
              ...rest,
              companyId: newCompany.id,
              taxAmount: Number(taxAmount),
              totalAmount: Number(sum.toFixed(2)),
              quotationServices: quotationServices,
            },
          });
        }

        let quotationData = await prisma.quotation.findFirst({
          include: { company: true },
        });

        res.status(200).json({ data: { quotationData }, message: "success" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

export default router;
