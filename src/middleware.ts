import { NextFunction, Request, Response } from "express";
import { RequestInterface } from "./interface";
import { User } from "../schema/user";

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
    const user = await User.findOne({ _id: code });
    const allUsr = await User.find();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
