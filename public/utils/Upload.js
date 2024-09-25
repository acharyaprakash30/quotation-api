"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads/');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true }); // recursive option ensures that nested directories are created if needed
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
    }
    else {
        req.fileError = "Upload Supported file (jpeg/jpg or png)";
        cb(null, false);
    }
};
const uploadMiddleware = (fields) => {
    return (req, res, next) => {
        const upload = (0, multer_1.default)({
            storage: storage,
            limits: {
                fileSize: 1024 * 1024 * 5, // 5MB
            },
            fileFilter: fileFilter,
        }).fields(fields);
        upload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
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
            }
            else if (err) {
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
exports.default = uploadMiddleware;
