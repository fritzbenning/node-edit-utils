import { describe, expect, it } from "vitest";
import { getTransformValues } from "./getTransformValues";

describe("getTransformValues", () => {
  it("should parse translate3d transform with positive values", () => {
    const element = document.createElement("div");
    element.style.transform = "translate3d(100px, 200px, 0px)";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse translate3d transform with negative values", () => {
    const element = document.createElement("div");
    element.style.transform = "translate3d(-50px, -100px, 0px)";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: -50, y: -100 });
  });

  it("should parse translate3d transform with decimal values", () => {
    const element = document.createElement("div");
    element.style.transform = "translate3d(123.45px, 678.90px, 0px)";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 123.45, y: 678.9 });
  });

  it("should return { x: 0, y: 0 } when transform is empty", () => {
    const element = document.createElement("div");

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should return { x: 0, y: 0 } when transform doesn't match pattern", () => {
    const element = document.createElement("div");
    element.style.transform = "rotate(45deg)";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should handle transform with spaces", () => {
    const element = document.createElement("div");
    element.style.transform = "translate3d( 100px , 200px , 0px )";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should handle non-zero z value", () => {
    const element = document.createElement("div");
    element.style.transform = "translate3d(100px, 200px, 50px)";

    const result = getTransformValues(element);
    expect(result).toEqual({ x: 100, y: 200 });
  });
});
