import express, { Express } from "express";
import userRouter from "./router/user";
import "dotenv/config";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
(async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/user", userRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
})();
