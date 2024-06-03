import { Router } from "express";
import { createUser, validateCode } from "../controller/user";

const router = Router();

router.post("/register", createUser);
router.post("/validate", validateCode);

export default router;
