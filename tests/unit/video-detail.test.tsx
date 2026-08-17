import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { VideoDetail } from "@/components/learning/VideoDetail";

describe("VideoDetail", () => {
  test("always provides a safe external YouTube fallback", () => {
    render(<VideoDetail backHref="/learning/songs" backLabel="Songs" resource={{
      slug: "song", assetName: "Hello", description: null, resourceFormat: "LEARNING_SONG_VIDEO", provider: "YOUTUBE",
      externalUrl: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "/song.svg", altText: "Song",
      levels: [{ code: "L3", name: "Level 3", sortOrder: 10 }], curriculumUnit: null,
    }} />);
    expect(screen.getByRole("link", { name: "Mở trên YouTube" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Mở trên YouTube" })).toHaveAttribute("rel", "noopener noreferrer");
  });
});
