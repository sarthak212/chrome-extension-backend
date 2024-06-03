export function requiredFieldValidation(fields: string[], value: any) {
  for (let i = 0; i < fields.length; i++) {
    if (!value[fields[i]]) {
      return `${fields[i]} is required`;
    }
  }
  return null;
}
