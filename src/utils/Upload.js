import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = path.join(__dirname, '../../uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    console.log("File received:", file.originalname);
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileError = "Upload Supported file (jpeg/jpg or png)";
    cb(null, false);
  }
};

const uploadMiddleware = (fields) => {
  return (req, res, next) => {
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: fileFilter,
    }).fields(fields);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          success: false,
          error: "Multer error",
        });
      }
      if (req.fileError) {
        return res.status(415).json({
          success: false,
          error: {
            logo: req.fileError,
          },
        });
      } else if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: "Server Error",
        });
      }

      next();
    });
  };
};

export default uploadMiddleware;
