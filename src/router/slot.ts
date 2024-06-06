import { Router } from "express";
import { updateSlotAvailability, uploadScreenShot } from "../controller/slot";

const router = Router();

router.post("/upload", uploadScreenShot);
router.post("/update", updateSlotAvailability);

export default router;
