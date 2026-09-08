import { afterEach, expect, test, vi } from "vitest";
import { register } from "@/instrumentation";
import { bootstrapDatabase } from "@/server/bootstrap-database";

vi.mock("@/server/bootstrap-database", () => ({ bootstrapDatabase: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

test.each(["development", "test"])("does not bootstrap in %s", async (mode) => {
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  vi.stubEnv("NODE_ENV", mode);
  await register();
  expect(bootstrapDatabase).not.toHaveBeenCalled();
});

test("awaits bootstrap on the production Node server", async () => {
  vi.stubEnv("NEXT_RUNTIME", "nodejs");
  vi.stubEnv("NODE_ENV", "production");
  const failure = new Error("bootstrap failed");
  vi.mocked(bootstrapDatabase).mockRejectedValueOnce(failure);
  await expect(register()).rejects.toBe(failure);
  expect(bootstrapDatabase).toHaveBeenCalledOnce();
});

test("does not bootstrap in the production Edge runtime", async () => {
  vi.stubEnv("NEXT_RUNTIME", "edge");
  vi.stubEnv("NODE_ENV", "production");
  await register();
  expect(bootstrapDatabase).not.toHaveBeenCalled();
});
