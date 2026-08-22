import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");

test("boots the database before the Next.js server accepts requests", () => {
  const instrumentationPath = path.join(root, "src", "instrumentation.ts");
  const bootstrapPath = path.join(root, "src", "server", "bootstrap-database.ts");

  expect(existsSync(instrumentationPath)).toBe(true);
  expect(existsSync(bootstrapPath)).toBe(true);

  const instrumentation = readFileSync(instrumentationPath, "utf8");
  const bootstrap = readFileSync(bootstrapPath, "utf8");
  expect(instrumentation).toContain("bootstrapDatabase");
  expect(bootstrap).toContain('"migrate", "deploy"');
  expect(bootstrap).toContain('"db", "seed"');
  expect(bootstrap).toContain("process.execPath");
  expect(bootstrap).toContain('"prisma", "build", "index.js"');
  expect(bootstrap).toContain("path.delimiter");
});
