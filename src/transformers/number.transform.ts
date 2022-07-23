import { Transform } from "class-transformer";

const TransformNumber = () => {
  return Transform(({ value }) =>
    value === undefined ? value : parseInt(value) || value
  );
};

export { TransformNumber };
