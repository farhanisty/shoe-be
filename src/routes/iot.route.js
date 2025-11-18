import { Router } from "express";
import { IotController } from "../controllers/iot.controller.js";
import { upload } from "../lib/upload.js";

const router = Router();

router.post("/unlock", IotController.unlockRemote);
router.get("/logs", IotController.getLogs);
router.post("/card", IotController.registerCard);

router.post("/upload-evidence", upload.single("image"), IotController.uploadEvidence);

export default router;