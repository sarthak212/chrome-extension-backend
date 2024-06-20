import { Request, Response } from "express";
import {
  createUserValidation,
  validateUserValidation,
} from "../validation/user";
import { User } from "../schema/user";
import { sendToken } from "../helpers/mailer";

export async function createUser(req: Request, res: Response) {
  const { email }: { email: string } = req.body;
  const validationRes = await createUserValidation(email);
  if (validationRes || true) {
    return res.status(400).json({ message: validationRes });
  }
  const user = await User.create({
    email,
    total_count: 20,
    contribution_count: 0,
    web_used_count: 0,
    extension_used_count: 0,
  });

  // Send Email to user with Code

  await sendToken({
    to: email,
    subject: "Access Code for Verification | Stamped",
    token: user.id,
  });
  return res.status(200).json({
    message:
      "Code is sent to your email. Please add that code in below input to verify!",
    code: user.id,
  });
}

export async function validateCode(req: Request, res: Response) {
  const { code }: { code: string } = req.body;
  const validationRes = await validateUserValidation(code);
  if (validationRes) {
    return res.status(400).json({ message: validationRes });
  }
  const user = await User.findOne({
    _id: code,
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid Code, Please Enter a valid Code!" });
  }
  return res.status(200).json({ message: "Valid Code" });
}
