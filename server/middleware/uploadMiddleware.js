// server/middleware/uploadMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";

/*  Ensure directory exists */
const ensureDir = (dir) => {
  if (!dir) return;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/*  Storage config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";

    if (file.fieldname === "avatar") {
      folder = "uploads/avatars";
    } else if (file.fieldname === "banner") {
      folder = "uploads/banners";
    } else if (file.fieldname === "video") {
      folder = "uploads/videos";
    } else if (file.fieldname === "thumbnail") {
      folder = "uploads/thumbnails";
    }

    ensureDir(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;