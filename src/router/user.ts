import { Router } from "express";
import { createUser, validateCode } from "../controller/user";
import { rateLimit } from "express-rate-limit";
const router = Router();
const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

router.post("/register", userLimiter, createUser);
router.post("/validate", userLimiter, validateCode);

export default router;
