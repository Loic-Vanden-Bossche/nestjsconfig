import { Transform } from "class-transformer";

const TransformArray = () => {
  return Transform(({ value }: { value: string }) =>
    value === undefined ? value : value.split(",").map((item) => item.trim())
  );
};

export { TransformArray };
