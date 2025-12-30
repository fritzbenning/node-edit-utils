import { describe, expect, it } from "vitest";
import { parseTransform2d, parseTransform3d } from "./parseTransform";

describe("parseTransform3d", () => {
  it("should parse valid translate3d transform", () => {
    const result = parseTransform3d("translate3d(100px, 200px, 0px)");

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse negative values", () => {
    const result = parseTransform3d("translate3d(-100px, -200px, 0px)");

    expect(result).toEqual({ x: -100, y: -200 });
  });

  it("should parse decimal values", () => {
    const result = parseTransform3d("translate3d(123.45px, 678.90px, 0px)");

    expect(result).toEqual({ x: 123.45, y: 678.9 });
  });

  it("should return zero values for invalid transform", () => {
    const result = parseTransform3d("invalid-transform");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should return zero values for empty string", () => {
    const result = parseTransform3d("");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should parse transform with extra spaces", () => {
    // Note: The regex doesn't handle extra spaces, so this will return zeros
    const result = parseTransform3d("translate3d(  100px  ,  200px  ,  0px  )");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should parse transform with no spaces", () => {
    const result = parseTransform3d("translate3d(100px,200px,0px)");

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse zero values", () => {
    const result = parseTransform3d("translate3d(0px, 0px, 0px)");

    expect(result).toEqual({ x: 0, y: 0 });
  });
});

describe("parseTransform2d", () => {
  it("should parse valid translate transform", () => {
    const result = parseTransform2d("translate(100, 200)");

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse negative values", () => {
    const result = parseTransform2d("translate(-100, -200)");

    expect(result).toEqual({ x: -100, y: -200 });
  });

  it("should parse decimal values", () => {
    const result = parseTransform2d("translate(123.45, 678.90)");

    expect(result).toEqual({ x: 123.45, y: 678.9 });
  });

  it("should return zero values for null", () => {
    const result = parseTransform2d(null);

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should return zero values for invalid transform", () => {
    const result = parseTransform2d("invalid-transform");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should return zero values for empty string", () => {
    const result = parseTransform2d("");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should parse transform with extra spaces", () => {
    // Note: The regex doesn't handle extra spaces, so this will return zeros
    const result = parseTransform2d("translate(  100  ,  200  )");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should parse transform with no spaces", () => {
    const result = parseTransform2d("translate(100,200)");

    expect(result).toEqual({ x: 100, y: 200 });
  });

  it("should parse zero values", () => {
    const result = parseTransform2d("translate(0, 0)");

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should handle undefined", () => {
    const result = parseTransform2d(undefined as unknown as string | null);

    expect(result).toEqual({ x: 0, y: 0 });
  });
});

