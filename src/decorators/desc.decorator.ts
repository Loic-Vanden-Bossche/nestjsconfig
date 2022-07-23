import "reflect-metadata";

const Desc = <T>(description: string) => {
  return (target: T, propertyKey: string) => {
    Reflect.defineMetadata(
      `custom:description:${propertyKey}`,
      description,
      target,
      propertyKey
    );
  };
};

export { Desc };
