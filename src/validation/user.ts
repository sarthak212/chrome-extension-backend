import { PrismaClient } from "@prisma/client";
import { requiredFieldValidation } from ".";

const prisma = new PrismaClient();

export async function createUserValidation(email: string) {
  const response = requiredFieldValidation(["email"], { email });
  if (response) {
    return response;
  }
  const alreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (alreadyExist) {
    return `User with email ${email} already exist`;
  }
  return false;
}

export async function validateUserValidation(code: string) {
  const response = requiredFieldValidation(["code"], { code });
  if (response) {
    return response;
  }

  return null;
}
