import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  createUserValidation,
  validateUserValidation,
} from "../validation/user";

const prisma = new PrismaClient();

export async function createUser(req: Request, res: Response) {
  const { email }: { email: string } = req.body;
  const validationRes = await createUserValidation(email);
  if (validationRes) {
    return res.status(400).json({ message: validationRes });
  }
  const user = await prisma.user.create({
    data: {
      email,
      total_count: 20,
      contribution_count: 0,
      web_used_count: 0,
      extension_used_count: 0,
    },
  });

  // Send Email to user with Code
  return res.status(200).json({ message: "User created", code: user.id });
}

export async function validateCode(req: Request, res: Response) {
  const { code }: { code: string } = req.body;
  const validationRes = await validateUserValidation(code);
  if (validationRes) {
    return res.status(400).json({ message: validationRes });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: code,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid Code" });
  }
  return res.status(200).json({ message: "Valid Code" });
}
