import multer from "multer";

const storage = multer.memoryStorage();

// allow uploading a test pdf + multiple optional question images
export const upload = multer({ storage }).fields([
  { name: "pdf", maxCount: 1 },
  { name: "images", maxCount: 20 },
]);
