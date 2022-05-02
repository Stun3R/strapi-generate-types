/**
 * Module dependencies
 */

// Node.js core.
import { join } from "path";

// Extra feature for fs Node.js core module.
import { ensureDir, outputFile } from "fs-extra";

// CLI color mode.
import { blue, green } from "chalk";

// Codegen core.
import { codegen } from "@graphql-codegen/core";
import { Types } from "@graphql-codegen/plugin-helpers/types";

// GraphQL Dependencies in order to use Codegen.
import * as typescriptPlugin from "@graphql-codegen/typescript";
import { printSchema, parse, GraphQLSchema } from "graphql";
import { loadSchema } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";

// Options get by the prompt.
export interface GenerateOptions {
  host: string;
  name: string;
  dir: string;
}

/**
 * `$ strapi-sdk generate`
 *
 * Generate Typescript types based on your GraphQL Schema.
 */

export const quickGen = async (url: string, dir: string, name: string): Promise<void> => {
  try {

    // Build initial scope.
    const scope = {
      host: url,
      outputDir: dir,
      outputName: name,
      filePath: join(`${dir}/${name}`),
    };
    /* remove "/" from scope.host in case it exists */
    scope.host = scope.host.replace(/\/$/, "");

    console.log(`${blue("Info")}: Generating types from GraphQL at ${green(scope.host + "/graphql")}.`);

    // Load schema from Strapi API
    const schema: GraphQLSchema = await loadSchema(`${scope.host}/graphql`, {
      loaders: [new UrlLoader()],
    });

    // Build Codegen config.
    const config: Types.GenerateOptions = {
      schema: parse(printSchema(schema)),
      filename: scope.outputName,
      documents: [],
      config: {},
      plugins: [
        {
          typescript: {},
        },
      ],
      pluginMap: {
        typescript: typescriptPlugin,
      },
    };

    // Generate types
    const output: string = await codegen(config);

    // Create output directorie recursively.
    await ensureDir(scope.outputDir);

    // Write the generated type.
    await outputFile(scope.filePath, output);

    // Log the success.
    console.log(`${blue("Info")}: Generated your types at ${green(scope.filePath)}.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
