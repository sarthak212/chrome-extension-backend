import { Request, Response } from "express";

export default function createUser(req: Request, res: Response) {
  return res.status(200).json({ message: "User created" });
}
