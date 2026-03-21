import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Audio
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/flac",
    "audio/opus",
    // PDF
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: mp3, mp4, wav, ogg, webm, flac, opus, pdf`,
      ),
      false,
    );
  }
};

export const upload = multer({ storage, fileFilter });