import express, { Express } from "express";
import userRouter from "./router/user";
import slotRouter from "./router/slot";
import "dotenv/config";
import { checkUserCode } from "./middleware";
import mongoose from "mongoose";
import cors from "cors";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
(async () => {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());
  await mongoose.connect(process.env.DATABASE_URL!);
  app.use("/user", userRouter);
  app.use(checkUserCode);
  app.use("/slot", slotRouter);
  // listen port
  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
})();
