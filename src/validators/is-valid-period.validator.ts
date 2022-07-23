import {
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

const IsValidPeriod = (validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isValidPeriod",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isValidPeriod(value);
        },
        defaultMessage(): string {
          return `$property must be a valid period`;
        },
      },
    });
  };
};

const isValidPeriod = (value: unknown) =>
  isString(value) &&
  new RegExp(
    `^[1-9]-(${["hour", "day", "week", "month", "year"].join("|")})$`
  ).test(value);

export { IsValidPeriod, isValidPeriod };
