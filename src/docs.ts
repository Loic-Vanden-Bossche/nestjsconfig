import * as dayjs from "dayjs";
import * as fs from "fs";
import * as path from "path";
import { getDesc, getIsSecret, getValidators } from "./metadata";
import { ClassConstructor } from "class-transformer";
import { toTitleCase } from "@boilerplate/utils";

class ConfigLine {
  key = "";
  default = "";
  description = "";
  validators: string[] = [""];
  protected = "";
}

const checkConfigDocDate = (docFile: string, fileWatchDir: string): boolean => {
  if (!fs.existsSync(docFile)) return true;

  const docDate = dayjs(fs.statSync(docFile).mtime);

  return fs
    .readdirSync(fileWatchDir)
    .map((file) => {
      const stats = fs.statSync(path.join(fileWatchDir, file));
      return stats.mtime;
    })
    .some((mtime) => docDate.isBefore(mtime, "second"));
};

const getConfigDoc = <T>(
  dto: ClassConstructor<T>,
  configDefault: T
): ConfigLine[] => {
  return Object.entries(configDefault).map(([key, value]) => {
    return {
      key,
      default: value,
      validators: getValidators(dto, key),
      description: getDesc(dto, key) || "",
      protected: getIsSecret(dto, key) ? "Yes" : "No",
    };
  });
};

const generateTable = (docConfig: ConfigLine[]): string => {
  const headers = Object.keys(new ConfigLine());
  return (
    "| " +
    headers.map((h) => toTitleCase(h)).join(" | ") +
    " |\n" +
    "|" +
    headers.map(() => ":---").join(" | ") +
    "|\n" +
    docConfig
      .map((configLine) => {
        return (
          "| " +
          headers
            .map((h) => {
              const value = configLine[h];
              if (Array.isArray(value)) {
                return value.join(", ");
              }
              return value;
            })
            .join(" | ") +
          " |"
        );
      })
      .join("\n")
  );
};

const generateMarkdown = (body: string, subTitle: string) => {
  return `
# Configuration
### ${subTitle}\n  
${body}\n
Generated on ${new Date().toLocaleString()}`;
};

const triggerConfigDocGen = <T>(
  configDto: ClassConstructor<T>,
  configDefault: T,
  subTitle: string,
  docFile = "CONFIG.md",
  fileWatchDir = "./config"
) => {
  return new Promise<ConfigLine[] | null>(async (resolve) => {
    if (checkConfigDocDate(docFile, fileWatchDir)) {
      const docConfig = getConfigDoc(configDto, configDefault);
      fs.writeFileSync(
        path.join(process.cwd(), docFile),
        generateMarkdown(generateTable(docConfig), subTitle),
        {
          encoding: "utf8",
          flag: "w",
        }
      );
      resolve(docConfig);
    } else {
      resolve(null);
    }
  });
};

export { triggerConfigDocGen, getConfigDoc };
