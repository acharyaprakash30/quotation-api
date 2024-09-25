import express from "express";
import prisma from "../utils/client";
import uploadMiddleware from "../utils/Upload";

const router = express.Router();
router
  .route("/")
  .get( async (req, res) => {
    try {
      res.status(200).json({ data: "welcome to quotation api", message: "success" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

router
  .route("/quotation")
  .get( async (req, res) => {
    try {
      let quotations = await prisma.quotation.findFirst({
        include: {
          company: true,
        },
      });
      res.status(200).json({ data: quotations, message: "success" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })

  .post(
    uploadMiddleware([
        { name: "logo", maxCount: 1 },
        { name: "managerSignature", maxCount: 1 },
      ]),
    async (req:any, res) => {
    try {

      let { name, manager, phoneNumber,taxAmount,totalAmount,quotationServices, ...rest } =req.body;
      let sum = 0;
      if(!name || !manager || !phoneNumber || !taxAmount || !totalAmount || !quotationServices) {
        return res.status(400).json({ error: "All fields are required" });
      }

      let quotationService = JSON.parse(quotationServices);
      if(quotationService && quotationService.length > 0) {
      
        quotationService.map((item:{service:string,hours:string,price:string,total:number,description:string})=>{
             sum  =  sum + (Number(item.hours) * Number(item.price));
        })
        // sum = sum - Number(taxAmount);
        if(sum < 0){
          throw new Error("Tax amount shouldnot be greater then total amount");
        }
      }


      let logo =req.files && req.files?.logo ?  req.files?.logo?.[0]?.filename : "";
      let managerSignature = req.files && req.files?.managerSignature ? req.files?.managerSignature?.[0]?.filename : "";
 
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
          where: {
            id: company.id,
          },
          data: companyData,
        });
        await prisma.quotation.update({
          where: {
            id: quotation.id,
          },
          data: {
            ...rest,
            companyId: company.id,
            taxAmount: Number(taxAmount),
            totalAmount:Number(sum),
            quotationServices: quotationServices
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
            taxAmount:Number(taxAmount),
            totalAmount:Number(sum),
            quotationServices: quotationServices
          },
        });
      }
      let quotationData = await prisma.quotation.findFirst({
        include: {
          company: true,
        },
      });
      res.status(200).json({ data: { quotationData }, message: "success" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
