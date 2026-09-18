import multer from "multer";

const storage = multer.memoryStorage();

// 👇 use "pdf" as the field name, since you upload PDF
export const singleUpload = multer({ storage }).single("pdf"); // generic
