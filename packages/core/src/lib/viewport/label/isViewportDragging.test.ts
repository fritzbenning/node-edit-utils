import { beforeEach, describe, expect, it } from "vitest";
import { isViewportDragging, setViewportDragging } from "./isViewportDragging";

describe("isViewportDragging", () => {
  beforeEach(() => {
    // Reset dragging state before each test
    setViewportDragging(false);
  });

  it("should return false initially", () => {
    expect(isViewportDragging()).toBe(false);
  });

  it("should return true after setting dragging to true", () => {
    setViewportDragging(true);
    expect(isViewportDragging()).toBe(true);
  });

  it("should return false after setting dragging to false", () => {
    setViewportDragging(true);
    setViewportDragging(false);
    expect(isViewportDragging()).toBe(false);
  });

  it("should maintain state across multiple calls", () => {
    setViewportDragging(true);
    expect(isViewportDragging()).toBe(true);
    expect(isViewportDragging()).toBe(true);
    expect(isViewportDragging()).toBe(true);

    setViewportDragging(false);
    expect(isViewportDragging()).toBe(false);
    expect(isViewportDragging()).toBe(false);
  });
});
