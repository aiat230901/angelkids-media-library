import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const prismaCli = path.join(process.cwd(), "node_modules", "prisma", "build", "index.js");
const environment = {
  ...process.env,
  PATH: [path.join(process.cwd(), "node_modules", ".bin"), process.env.PATH].filter(Boolean).join(path.delimiter),
};

export async function bootstrapDatabase() {
  for (const args of [["migrate", "deploy"], ["db", "seed"]]) {
    const { stdout, stderr } = await run(process.execPath, [prismaCli, ...args], { cwd: process.cwd(), env: environment });
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
  }
}
