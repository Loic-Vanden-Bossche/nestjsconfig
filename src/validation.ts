import { validateSync } from "class-validator";
import { getSecretKeys } from "./metadata";
import { ClassConstructor, plainToClass } from "class-transformer";
import * as chalk from "chalk";

export const validateConfig = <T>(
  dto: ClassConstructor<T>,
  defaultConfig: T,
  envConfig: Record<string, unknown>,
  silent = false
): T => {
  const validatedConfig = plainToClass(dto, envConfig, {
    strategy: "excludeAll",
  });

  const errors = validateSync(validatedConfig as Record<string, unknown>, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error(
      chalk.red("Some errors happened while validating the configuration:")
    );
    errors
      .flatMap((error) =>
        Object.values(error.constraints || {}).map(
          (e) =>
            `${chalk.red(e)} - ${chalk.blue(error.value)}`
        )
      )
      .forEach((e) => console.error(e));
    throw new Error("Invalid configuration");
  }

  const secretKeys = getSecretKeys(dto, defaultConfig);

  if (!silent) {
    Object.keys(validatedConfig)
      .map(
        (key) =>
          `\n[${chalk.magenta(key)}]: ${chalk.blue(
            secretKeys.indexOf(key) !== -1
              ? "****"
              : (validatedConfig as Record<string, unknown>)[key]
          )}`
      )
      .join();
  }

  return validatedConfig;
};
