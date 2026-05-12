import { validateContentDefinitions } from "./contentValidation.js";

declare const process: {
  exit: (code: number) => never;
};

const errors = validateContentDefinitions();

if (errors.length > 0) {
  console.error("Content validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Content validation passed.");
