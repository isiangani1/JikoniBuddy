import { spawnSync } from "node:child_process";
import path from "node:path";
import dotenv from "dotenv";

const rootEnv = path.resolve(process.cwd(), "..", "..", ".env");
const rootSchema = path.resolve(process.cwd(), "..", "..", "prisma", "schema.prisma");
dotenv.config({ path: rootEnv });

if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-prisma.js <prisma args>");
  process.exit(1);
}

const hasSchemaArg = args.includes("--schema");
let prismaArgs = args;
if (!hasSchemaArg) {
  const [command, subcommand, ...rest] = args;
  const needsSubcommand =
    (command === "db" || command === "migrate") &&
    subcommand &&
    !subcommand.startsWith("-");
  prismaArgs = needsSubcommand
    ? [command, subcommand, "--schema", rootSchema, ...rest]
    : [command, "--schema", rootSchema, subcommand, ...rest].filter(Boolean);
}

const result = spawnSync("npx", ["prisma", ...prismaArgs], {
  stdio: "inherit",
  env: process.env
});

process.exit(result.status ?? 0);
