import {Router} from "express"
import { upload } from "../config/multer.config.js";

import { authUser } from "../middleware/auth.middleware.js";

import {
  smartQueryController,
  generateImageController,
  transcribeAudioController,
  summarizeDocumentController,
} from "../controllers/ai.controller.js";

const router = Router();

router.post("/query", authUser, smartQueryController);

router.post("/image", authUser, generateImageController);

router.post(
  "/transcribe",
  authUser,
  upload.single("audio"),
  transcribeAudioController,
);

router.post(
  "/summarize",
  authUser,
  upload.single("pdf"),
  summarizeDocumentController,
);

export default router;
