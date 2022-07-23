import { ClassConstructor } from "class-transformer";

const getConfigMetadata = <T>(
  dto: ClassConstructor<T>,
  metadataKey: string,
  propertyName: string
) => {
  const instance = new dto();
  return Reflect.getMetadataKeys(instance, propertyName)
    .filter((key) => key.toString().startsWith(`custom:${metadataKey}`))
    .map((key) => Reflect.getMetadata(key, instance, propertyName));
};

export const getDesc = <T>(
  dto: ClassConstructor<T>,
  propertyName: string
): string => getConfigMetadata(dto, "description", propertyName)[0];

export const getValidators = <T>(
  dto: ClassConstructor<T>,
  propertyName: string
): string[] => getConfigMetadata(dto, "validator", propertyName);

export const getIsSecret = <T>(
  dto: ClassConstructor<T>,
  propertyName: string
): boolean => getConfigMetadata(dto, "isSecret", propertyName)[0];

export const getSecretKeys = <T>(
  dto: ClassConstructor<T>,
  defaultConfig: T
): string[] => {
  return Object.keys(defaultConfig).filter((key) => getIsSecret(dto, key));
};
