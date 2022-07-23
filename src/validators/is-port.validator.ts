import { registerDecorator, ValidationOptions } from "class-validator";

const IsPortNumber = (validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isPortNumber",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isPortNumber(value);
        },
        defaultMessage(): string {
          return `$property must be a valid port number`;
        },
      },
    });
  };
};

const isPortNumber = (value: unknown) => {
  return Number.isInteger(value) && value >= 1 && value <= 65535;
};

export { IsPortNumber, isPortNumber };
