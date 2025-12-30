import { describe, expect, it, vi } from "vitest";
import { getViewportDimensions } from "./getViewportDimensions";

describe("getViewportDimensions", () => {
  it("should return documentElement clientWidth and clientHeight", () => {
    // Mock documentElement dimensions
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      writable: true,
      configurable: true,
      value: 1080,
    });

    const result = getViewportDimensions();

    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });

  it("should fallback to window.innerWidth and innerHeight when clientWidth/clientHeight are 0", () => {
    // Mock documentElement dimensions as 0
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });

    const result = getViewportDimensions();

    expect(result.width).toBe(1024);
    expect(result.height).toBe(768);
  });

  it("should return object with width and height properties", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      writable: true,
      configurable: true,
      value: 600,
    });

    const result = getViewportDimensions();

    expect(result).toHaveProperty("width");
    expect(result).toHaveProperty("height");
    expect(typeof result.width).toBe("number");
    expect(typeof result.height).toBe("number");
  });

  it("should handle different viewport sizes", () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      writable: true,
      configurable: true,
      value: 667,
    });

    const result = getViewportDimensions();

    expect(result.width).toBe(375);
    expect(result.height).toBe(667);
  });
});

