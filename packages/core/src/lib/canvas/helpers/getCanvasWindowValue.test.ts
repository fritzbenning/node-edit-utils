import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCanvasWindowValue } from "./getCanvasWindowValue";

describe("getCanvasWindowValue", () => {
  beforeEach(() => {
    // Clear any existing canvas properties
    delete (window as unknown as Record<string, unknown>).canvas;
    delete (window as unknown as Record<string, unknown>).customCanvas;
  });

  afterEach(() => {
    // Clean up
    delete (window as unknown as Record<string, unknown>).canvas;
    delete (window as unknown as Record<string, unknown>).customCanvas;
  });

  it("should return value from nested path", () => {
    const mockValue = { keyboard: { enable: vi.fn() } };
    (window as unknown as Record<string, unknown>).canvas = mockValue;

    const result = getCanvasWindowValue(["keyboard", "enable"], "canvas");

    expect(result).toBe(mockValue.keyboard.enable);
  });

  it("should return undefined when canvas does not exist", () => {
    const result = getCanvasWindowValue(["keyboard", "enable"], "nonExistentCanvas");

    expect(result).toBeUndefined();
  });

  it("should return undefined when path does not exist", () => {
    (window as unknown as Record<string, unknown>).canvas = {};

    const result = getCanvasWindowValue(["nonExistent", "path"], "canvas");

    expect(result).toBeUndefined();
  });

  it("should return undefined when intermediate path is null", () => {
    (window as unknown as Record<string, unknown>).canvas = { keyboard: null };

    const result = getCanvasWindowValue(["keyboard", "enable"], "canvas");

    expect(result).toBeUndefined();
  });

  it("should return undefined when intermediate path is undefined", () => {
    (window as unknown as Record<string, unknown>).canvas = { keyboard: undefined };

    const result = getCanvasWindowValue(["keyboard", "enable"], "canvas");

    expect(result).toBeUndefined();
  });

  it("should use default canvas name when not provided", () => {
    const mockValue = { keyboard: { enable: vi.fn() } };
    (window as unknown as Record<string, unknown>).canvas = mockValue;

    const result = getCanvasWindowValue(["keyboard", "enable"]);

    expect(result).toBe(mockValue.keyboard.enable);
  });

  it("should handle custom canvas name", () => {
    const mockValue = { keyboard: { enable: vi.fn() } };
    (window as unknown as Record<string, unknown>).customCanvas = mockValue;

    const result = getCanvasWindowValue(["keyboard", "enable"], "customCanvas");

    expect(result).toBe(mockValue.keyboard.enable);
  });

  it("should handle single level path", () => {
    const mockValue = { property: "value" };
    (window as unknown as Record<string, unknown>).canvas = mockValue;

    const result = getCanvasWindowValue(["property"], "canvas");

    expect(result).toBe("value");
  });

  it("should handle deep nested path", () => {
    const mockValue = {
      level1: {
        level2: {
          level3: {
            level4: "deep-value",
          },
        },
      },
    };
    (window as unknown as Record<string, unknown>).canvas = mockValue;

    const result = getCanvasWindowValue(["level1", "level2", "level3", "level4"], "canvas");

    expect(result).toBe("deep-value");
  });

  it("should handle empty path array", () => {
    const mockValue = { property: "value" };
    (window as unknown as Record<string, unknown>).canvas = mockValue;

    const result = getCanvasWindowValue([], "canvas");

    expect(result).toBe(mockValue);
  });

  it("should handle when canvas is not an object", () => {
    (window as unknown as Record<string, unknown>).canvas = "not-an-object";

    const result = getCanvasWindowValue(["keyboard", "enable"], "canvas");

    expect(result).toBeUndefined();
  });
});
