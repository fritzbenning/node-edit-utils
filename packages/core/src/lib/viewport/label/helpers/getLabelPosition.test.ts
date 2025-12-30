import { describe, expect, it } from "vitest";
import { getLabelPosition } from "./getLabelPosition";

describe("getLabelPosition", () => {
  it("should parse translate transform with positive values", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "translate(100, 200)");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse translate transform with negative values", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "translate(-50, -100)");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: -50, y: -100 });
  });

  it("should parse translate transform with decimal values", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "translate(123.45, 678.90)");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: 123.45, y: 678.9 });
  });

  it("should return { x: 0, y: 0 } when transform is null", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should return { x: 0, y: 0 } when transform doesn't match pattern", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "rotate(45)");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should handle transform with spaces", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", "translate(100, 200)");

    const result = getLabelPosition(group as unknown as SVGGElement);
    expect(result).toEqual({ x: 100, y: 200 });
  });
});
