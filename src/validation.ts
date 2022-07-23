import { validateSync } from "class-validator";
import { getSecretKeys } from "./metadata";
import { Logger } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";

export const validateConfig = <T>(
  dto: ClassConstructor<T>,
  defaultConfig: T,
  envConfig: Record<string, unknown>
): T => {
  const logger = new Logger("Config");
  const validatedConfig = plainToClass(dto, envConfig, {
    strategy: "excludeAll",
  });

  const errors = validateSync(validatedConfig as Record<string, unknown>, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    logger.error("Some errors happened while validating the configuration:");
    errors
      .flatMap((error) =>
        Object.values(error.constraints || {}).map(
          (e) => `${e} - ${error.value}`
        )
      )
      .forEach((e) => logger.error(e));
    throw new Error("Invalid configuration");
  }

  const secretKeys = getSecretKeys(dto, defaultConfig);

  logger.log(
    Object.keys(validatedConfig)
      .map(
        (key) =>
          `\n${key}: ${
            secretKeys.indexOf(key) !== -1
              ? "****"
              : (validatedConfig as Record<string, unknown>)[key]
          }`
      )
      .join()
  );

  return validatedConfig;
};
