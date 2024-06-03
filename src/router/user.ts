import { Router } from "express";
import createUser from "../controller/user";

const router = Router();

router.post("/register", createUser);

export default router;
