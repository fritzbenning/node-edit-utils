import { describe, expect, it } from "vitest";
import { RESIZE_CONFIG } from "../constants";
import { calcConstrainedWidth } from "./calcConstrainedWidth";

describe("calcConstrainedWidth", () => {
  it("should return startWidth + deltaX when within bounds", () => {
    const startWidth = 100;
    const deltaX = 50;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(150);
  });

  it("should return minWidth when result is below minimum", () => {
    const startWidth = 10;
    const deltaX = -10;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(RESIZE_CONFIG.minWidth);
  });

  it("should return maxWidth when result is above maximum", () => {
    const startWidth = 2500;
    const deltaX = 100;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(RESIZE_CONFIG.maxWidth);
  });

  it("should round the result", () => {
    const startWidth = 100;
    const deltaX = 50.7;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(151);
  });

  it("should handle negative deltaX correctly", () => {
    const startWidth = 200;
    const deltaX = -50;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(150);
  });

  it("should handle zero deltaX", () => {
    const startWidth = 100;
    const deltaX = 0;
    const result = calcConstrainedWidth(startWidth, deltaX);
    expect(result).toBe(100);
  });
});
