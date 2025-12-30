import { afterEach, describe, expect, it, vi } from "vitest";
import { getZoomValue } from "./getZoomValue";

describe("getZoomValue", () => {
  afterEach(() => {
    // Reset CSS custom property
    document.body.style.setProperty("--zoom", "");
  });

  it("should return 1 when --zoom is not set", () => {
    document.body.style.removeProperty("--zoom");
    const result = getZoomValue();
    expect(result).toBe(1);
  });

  it("should return parsed float value from --zoom CSS variable", () => {
    document.body.style.setProperty("--zoom", "1.5");
    const result = getZoomValue();
    expect(result).toBe(1.5);
  });

  it("should handle integer zoom values", () => {
    document.body.style.setProperty("--zoom", "2");
    const result = getZoomValue();
    expect(result).toBe(2);
  });

  it("should handle decimal zoom values", () => {
    document.body.style.setProperty("--zoom", "0.75");
    const result = getZoomValue();
    expect(result).toBe(0.75);
  });

  it("should trim whitespace from zoom value", () => {
    // Note: CSS custom properties don't typically have whitespace, but we test the trim logic
    // We'll mock getComputedStyle to return a value with whitespace
    const mockGetComputedStyle = vi.spyOn(window, "getComputedStyle");
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: () => " 1.5 ",
    } as unknown as CSSStyleDeclaration);

    const result = getZoomValue();
    expect(result).toBe(1.5);

    mockGetComputedStyle.mockRestore();
  });

  it("should return 1 when --zoom is empty string", () => {
    document.body.style.setProperty("--zoom", "");
    const result = getZoomValue();
    expect(result).toBe(1);
  });
});
