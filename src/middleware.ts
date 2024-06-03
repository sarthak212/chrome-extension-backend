import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { RequestInterface } from "./interface";
const prisma = new PrismaClient();

export const checkUserCode = async (
  req: RequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const code = token.split(" ")[1];
    const user = await prisma.user.findUnique({ where: { id: code } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
