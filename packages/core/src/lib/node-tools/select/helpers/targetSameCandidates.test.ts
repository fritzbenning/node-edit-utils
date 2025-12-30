import { describe, expect, it } from "vitest";
import { targetSameCandidates } from "./targetSameCandidates";

describe("targetSameCandidates", () => {
  const element1 = document.createElement("div");
  const element2 = document.createElement("div");
  const element3 = document.createElement("div");

  it("should return true when arrays are identical", () => {
    const cache = [element1, element2, element3];
    const current = [element1, element2, element3];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(true);
  });

  it("should return false when arrays have different lengths", () => {
    const cache = [element1, element2];
    const current = [element1, element2, element3];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(false);
  });

  it("should return false when arrays have same length but different elements", () => {
    const cache = [element1, element2];
    const current = [element2, element3];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(false);
  });

  it("should return false when arrays have same elements in different order", () => {
    const cache = [element1, element2];
    const current = [element2, element1];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(false);
  });

  it("should return true for empty arrays", () => {
    const cache: Element[] = [];
    const current: Element[] = [];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(true);
  });

  it("should return false when one array is empty", () => {
    const cache: Element[] = [];
    const current = [element1];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(false);
  });

  it("should return true for single element arrays with same element", () => {
    const cache = [element1];
    const current = [element1];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(true);
  });

  it("should return false for single element arrays with different elements", () => {
    const cache = [element1];
    const current = [element2];

    const result = targetSameCandidates(cache, current);

    expect(result).toBe(false);
  });
});

