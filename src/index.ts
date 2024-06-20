import express, { Express } from "express";
import userRouter from "./router/user";
import slotRouter from "./router/slot";
import "dotenv/config";
import { checkUserCode } from "./middleware";
import mongoose from "mongoose";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
(async () => {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  });

  // Apply the rate limiting middleware to all requests.
  app.use(limiter);
  await mongoose.connect(process.env.DATABASE_URL!);
  app.use("/user", userRouter);
  app.use(checkUserCode);
  app.use("/slot", slotRouter);
  // listen port
  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
})();
