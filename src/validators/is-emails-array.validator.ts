import {
  isEmail,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

const IsEmailsArray = (validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isEmailsArray",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string[]) {
          return isEmailsArray(value);
        },
        defaultMessage(): string {
          return `$property must be an array of valid emails`;
        },
      },
    });
  };
};

const isEmailsArray = (value: unknown) =>
  Array.isArray(value) &&
  value.every((email: unknown) => isString(email) && isEmail(email));

export { IsEmailsArray, isEmailsArray };
