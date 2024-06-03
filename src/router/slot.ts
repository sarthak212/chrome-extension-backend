import { Router } from "express";
import { uploadScreenShot } from "../controller/slot";

const router = Router();

router.post("/upload", uploadScreenShot);

export default router;
