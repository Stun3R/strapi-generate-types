import { quickGen } from './commands/quick';
import { Command } from "commander";

import { generateTypes } from "./commands/generate";

import { version } from "../package.json";

// Initial program setup
const program = new Command();

// `$ strapi version || strapi -v || strapi --version`
program.version(version, "-v, --version", "Output the version number");
program
  .command("version")
  .description("Output your version of Strapi SDK")
  .action(() => {
    process.stdout.write(version + "\n");
    process.exit(0);
  });

// `$ strapi generate`
program
  .command("generate")
  .description("generate Typescript's types based on your GraphQL Schema")
  .action(async () => {
    await generateTypes();
  });

program
  .command("quickgen")
  .description("quickly generate Typescript types based on your GraphQL Schema using Arguments instead of manual prompts. Useful for use in npm scripts.")
  .argument('<url>', "Your Strapi URL")
  .option('-p, --path <location>', 'File path where you want to save the generated types', './models/')
  .option('-n, --file-name <filename>', 'File name of the generated types', 'types.ts')
  .action(async (url, options) => {
    await quickGen(url, options.path, options.fileName);
  });


program.parse(process.argv);
