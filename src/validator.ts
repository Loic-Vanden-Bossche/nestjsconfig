import { registerDecorator } from "class-validator";

type ValidatorFunction = (value: unknown, ...args: any[]) => boolean;

const registerValidator = (
  object: Record<string, unknown>,
  propertyName: string,
  validator: ValidatorFunction,
  ...args: unknown[]
) => {
  Reflect.defineMetadata(
    `custom:validator:${propertyName}:${validator.name}`,
    validator.name,
    object,
    propertyName
  );
  registerDecorator({
    name: validator.name,
    target: object.constructor,
    propertyName: propertyName,
    constraints: [],
    options: undefined,
    validator: {
      validate(value: any) {
        return validator(value, ...args);
      },
      defaultMessage(): string {
        return `${propertyName} must respect ${validator.name} constraint`;
      },
    },
  });
};

const ConfigValidator = (validator: ValidatorFunction, ...args: unknown[]) => {
  return (object: any, propertyName: string) => {
    registerValidator(object, propertyName, validator, ...args);
  };
};

const ConfigValidators = (...validators: Array<ValidatorFunction>) => {
  return (object: any, propertyName: string) => {
    validators.forEach((validator) =>
      registerValidator(object, propertyName, validator)
    );
  };
};

export { ConfigValidator, ConfigValidators };
