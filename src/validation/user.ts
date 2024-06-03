import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUserValidation(email: string) {
  const alreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (alreadyExist) {
    return true;
  }
  return false;
}
