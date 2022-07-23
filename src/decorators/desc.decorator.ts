import "reflect-metadata";

const Desc = (description: string) => {
  return (target: Record<string, unknown>, propertyKey: string) => {
    Reflect.defineMetadata(
      `custom:description:${propertyKey}`,
      description,
      target,
      propertyKey
    );
  };
};

export { Desc };
