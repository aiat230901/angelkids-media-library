import { describe, expect, test } from "vitest";
import nextConfig from "../../next.config";

describe("Next security configuration", () => {
  test("allows the published Angel Kids reader and cover hosts", async () => {
    const headers = await nextConfig.headers?.();
    const csp = headers?.[0].headers.find((header) => header.key === "Content-Security-Policy")?.value;

    expect(csp).toContain("https://mamnonangelkids.aflip.in");
    expect(csp).toContain("https://cdnm.heyzine.com");
    expect(nextConfig.images?.remotePatterns).toContainEqual({ protocol: "https", hostname: "cdnm.heyzine.com" });
  });
});
