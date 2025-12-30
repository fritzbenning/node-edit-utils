import { beforeEach, describe, expect, it } from "vitest";
import { calcWidth } from "./calcWidth";

describe("calcWidth", () => {
  beforeEach(() => {
    // Reset zoom data attribute
    document.body.dataset.zoom = "1";
  });

  it("should calculate width based on mouse event and start position", () => {
    const startX = 100;
    const startWidth = 200;
    const event = {
      clientX: 150,
    } as MouseEvent;

    const result = calcWidth(event, startX, startWidth);
    expect(result).toBe(250);
  });

  it("should account for zoom level", () => {
    document.body.dataset.zoom = "2";
    const startX = 100;
    const startWidth = 200;
    const event = {
      clientX: 150,
    } as MouseEvent;

    const result = calcWidth(event, startX, startWidth);
    // deltaX = (150 - 100) / 2 = 25
    expect(result).toBe(225);
  });

  it("should handle negative deltaX", () => {
    const startX = 150;
    const startWidth = 200;
    const event = {
      clientX: 100,
    } as MouseEvent;

    const result = calcWidth(event, startX, startWidth);
    expect(result).toBe(150);
  });

  it("should default to zoom 1 if dataset.zoom is not set", () => {
    delete document.body.dataset.zoom;
    const startX = 100;
    const startWidth = 200;
    const event = {
      clientX: 150,
    } as MouseEvent;

    const result = calcWidth(event, startX, startWidth);
    expect(result).toBe(250);
  });

  it("should respect min and max width constraints", () => {
    const startX = 100;
    const startWidth = 10;
    const event = {
      clientX: 50,
    } as MouseEvent;

    const result = calcWidth(event, startX, startWidth);
    // Should be clamped to minWidth (4)
    expect(result).toBe(4);
  });
});
