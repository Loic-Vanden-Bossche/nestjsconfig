import {
  isString,
  isURL,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

const IsUrlsArray = (validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isUrlArray",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string[]) {
          return isUrlArray(value);
        },
        defaultMessage(): string {
          return `$property must be an array of valid urls`;
        },
      },
    });
  };
};

const isUrlArray = (value: unknown) =>
  Array.isArray(value) &&
  value.every(
    (url: unknown) => isString(url) && isURL(url, { require_tld: false })
  );

export { IsUrlsArray, isUrlArray };
