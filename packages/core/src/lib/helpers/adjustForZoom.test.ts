import { describe, expect, it } from "vitest";
import { adjustForZoom } from "./adjustForZoom";

describe("adjustForZoom", () => {
  it("should divide value by zoom", () => {
    const result = adjustForZoom(100, 2);

    expect(result).toBe(50);
  });

  it("should handle zoom of 1", () => {
    const result = adjustForZoom(100, 1);

    expect(result).toBe(100);
  });

  it("should handle fractional zoom", () => {
    const result = adjustForZoom(100, 0.5);

    expect(result).toBe(200);
  });

  it("should handle decimal values", () => {
    const result = adjustForZoom(123.456, 2.5);

    expect(result).toBe(49.3824);
  });

  it("should use default precision of 5", () => {
    const result = adjustForZoom(100, 3);

    expect(result).toBe(33.33333);
  });

  it("should use custom precision", () => {
    const result = adjustForZoom(100, 3, 2);

    expect(result).toBe(33.33);
  });

  it("should handle zero value", () => {
    const result = adjustForZoom(0, 2);

    expect(result).toBe(0);
  });

  it("should handle negative values", () => {
    const result = adjustForZoom(-100, 2);

    expect(result).toBe(-50);
  });

  it("should handle precision of 0", () => {
    const result = adjustForZoom(100, 3, 0);

    expect(result).toBe(33);
  });

  it("should handle very small zoom values", () => {
    const result = adjustForZoom(100, 0.1);

    expect(result).toBe(1000);
  });
});

