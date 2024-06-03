import { User } from "@prisma/client";
import { Request } from "express";

export interface RequestInterface extends Request {
  user?: User;
}
