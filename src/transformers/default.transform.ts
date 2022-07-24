import { Transform } from "class-transformer";

const UseDefault = <T>(defaultConfig: T) => {
  return Transform(({ value, key }) =>
    value !== null && value !== undefined
      ? value
      : (defaultConfig as Record<string, unknown>)[key]
  );
};

export { UseDefault };
