import "reflect-metadata";

const Secret = () => {
  return <T>(target: T, propertyKey: string) => {
    Reflect.defineMetadata(
      `custom:isSecret:${propertyKey}`,
      true,
      target,
      propertyKey
    );
  };
};

export { Secret };
