import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { VideoDetail } from "@/components/learning/VideoDetail";

describe("VideoDetail", () => {
  test("keeps the embedded player and back link without an external YouTube link", () => {
    render(<VideoDetail backHref="/learning/songs" backLabel="Songs" resource={{
      slug: "song", assetName: "Hello", description: null, resourceFormat: "LEARNING_SONG_VIDEO", provider: "YOUTUBE",
      externalUrl: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "/song.svg", altText: "Song",
      levels: [{ code: "L3", name: "Level 3", sortOrder: 10 }], curriculumUnit: null,
    }} />);
    expect(screen.getByTitle("Hello")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(screen.getByRole("link", { name: /Quay lại Songs/i })).toHaveAttribute("href", "/learning/songs");
    expect(screen.queryByRole("link", { name: /Mở trên YouTube/i })).not.toBeInTheDocument();
    expect(screen.getByText("Độ tuổi")).toBeInTheDocument();
    expect(screen.getByText("3–4 tuổi")).toBeInTheDocument();
  });
});
