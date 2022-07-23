import { Transform } from "class-transformer";

const UseDefault = (defaultConfig: Record<string, unknown>) => {
  return Transform(({ value, key }) =>
    value !== null && value !== undefined ? value : defaultConfig[key]
  );
};

export { UseDefault };
