import { Transform } from "class-transformer";

const TransformBoolean = () => {
  return Transform(({ value }) =>
    value === undefined ? value : value === "true" || value === "1"
  );
};

export { TransformBoolean };
