import { describe, expect, test } from "vitest";
import { toYouTubeEmbedUrl, validateProviderUrl } from "@/server/providers/urls";

describe("provider URL safety", () => {
  test("normalizes supported YouTube URLs to the privacy-enhanced embed host", () => {
    expect(toYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=10")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(toYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  test("rejects non-HTTPS and lookalike provider hosts", () => {
    expect(validateProviderUrl("YOUTUBE", "http://youtube.com/watch?v=dQw4w9WgXcQ").success).toBe(false);
    expect(validateProviderUrl("YOUTUBE", "https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ").success).toBe(false);
    expect(validateProviderUrl("GOOGLE_DRIVE", "https://drive.google.com.evil.test/drive/folders/abc").success).toBe(false);
  });

  test("accepts only configured Heyzine reader hosts", () => {
    expect(validateProviderUrl("HEYZINE", "https://heyzine.com/flip-book/abc", ["heyzine.com"]).success).toBe(true);
    expect(validateProviderUrl("HEYZINE", "https://other.heyzine.com/flip-book/abc", ["heyzine.com"]).success).toBe(false);
  });

  test("requires a Google Drive folder URL", () => {
    expect(validateProviderUrl("GOOGLE_DRIVE", "https://drive.google.com/drive/folders/abc").success).toBe(true);
    expect(validateProviderUrl("GOOGLE_DRIVE", "https://drive.google.com/file/d/abc/view").success).toBe(false);
  });
});

