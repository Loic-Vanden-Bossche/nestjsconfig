import { Transform } from "class-transformer";

const UseEnvPort = () => {
  return Transform(({ value }) => process.env.PORT || value);
};

export { UseEnvPort };
