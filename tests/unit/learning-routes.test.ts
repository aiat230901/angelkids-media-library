import { expect, test } from "vitest";
import { getContentTypePath, WATCH_LISTINGS } from "@/config/learning-routes";

test("routes Virtual Teacher Guide videos through the Watch listing", () => {
  expect(getContentTypePath("watch", "virtual-teacher-guide")).toBe("/learning/watch/virtual-teacher-guide");
  expect(WATCH_LISTINGS["virtual-teacher-guide"]).toMatchObject({
    title: "Virtual Teacher Guide",
    lead: "Giáo viên ảo hướng dẫn bé khám phá nội dung và thực hành ngôn ngữ qua từng tình huống.",
    format: "VIRTUAL_TEACHER_GUIDE_VIDEO",
  });
});
