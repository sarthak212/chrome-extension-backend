import { requiredFieldValidation } from ".";
import { User } from "../schema/user";

export async function createUserValidation(email: string) {
  const response = requiredFieldValidation(["email"], { email });
  if (response) {
    return response;
  }
  const alreadyExist = await User.findOne({
    email,
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
