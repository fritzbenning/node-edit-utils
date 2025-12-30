import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getScreenBounds } from "./getScreenBounds";

describe("getScreenBounds", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it("should return bounds from getBoundingClientRect", () => {
    // Mock getBoundingClientRect
    const mockRect = {
      top: 100,
      left: 200,
      width: 300,
      height: 400,
      bottom: 500,
      right: 500,
      x: 200,
      y: 100,
      toJSON: vi.fn(),
    };
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(mockRect as DOMRect);

    const result = getScreenBounds(element);

    expect(result.top).toBe(100);
    expect(result.left).toBe(200);
    expect(result.width).toBe(300);
    expect(result.height).toBe(400);
  });

  it("should handle zero dimensions", () => {
    const mockRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    };
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(mockRect as DOMRect);

    const result = getScreenBounds(element);

    expect(result.top).toBe(0);
    expect(result.left).toBe(0);
    expect(result.width).toBe(0);
    expect(result.height).toBe(0);
  });

  it("should handle negative positions", () => {
    const mockRect = {
      top: -50,
      left: -100,
      width: 200,
      height: 150,
      bottom: 100,
      right: 100,
      x: -100,
      y: -50,
      toJSON: vi.fn(),
    };
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(mockRect as DOMRect);

    const result = getScreenBounds(element);

    expect(result.top).toBe(-50);
    expect(result.left).toBe(-100);
    expect(result.width).toBe(200);
    expect(result.height).toBe(150);
  });

  it("should handle decimal values", () => {
    const mockRect = {
      top: 123.45,
      left: 678.90,
      width: 234.56,
      height: 789.01,
      bottom: 912.46,
      right: 913.46,
      x: 678.90,
      y: 123.45,
      toJSON: vi.fn(),
    };
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(mockRect as DOMRect);

    const result = getScreenBounds(element);

    expect(result.top).toBe(123.45);
    expect(result.left).toBe(678.9);
    expect(result.width).toBe(234.56);
    expect(result.height).toBe(789.01);
  });

  it("should return object with all required properties", () => {
    const mockRect = {
      top: 100,
      left: 200,
      width: 300,
      height: 400,
      bottom: 500,
      right: 500,
      x: 200,
      y: 100,
      toJSON: vi.fn(),
    };
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(mockRect as DOMRect);

    const result = getScreenBounds(element);

    expect(result).toHaveProperty("top");
    expect(result).toHaveProperty("left");
    expect(result).toHaveProperty("width");
    expect(result).toHaveProperty("height");
    expect(typeof result.top).toBe("number");
    expect(typeof result.left).toBe("number");
    expect(typeof result.width).toBe("number");
    expect(typeof result.height).toBe("number");
  });
});

