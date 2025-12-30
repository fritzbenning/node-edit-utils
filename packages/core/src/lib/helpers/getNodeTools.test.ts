import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getNodeTools } from "./getNodeTools";

describe("getNodeTools", () => {
  beforeEach(() => {
    delete (window as Window & { nodeTools?: unknown }).nodeTools;
  });

  afterEach(() => {
    delete (window as Window & { nodeTools?: unknown }).nodeTools;
  });

  it("should return nodeTools when it exists on window", () => {
    const mockNodeTools = { test: "value" };
    (window as Window & { nodeTools?: unknown }).nodeTools = mockNodeTools;

    const result = getNodeTools();

    expect(result).toBe(mockNodeTools);
  });

  it("should return undefined when nodeTools does not exist", () => {
    const result = getNodeTools();

    expect(result).toBeUndefined();
  });

  it("should return updated value when nodeTools changes", () => {
    const mockNodeTools1 = { test: "value1" };
    (window as Window & { nodeTools?: unknown }).nodeTools = mockNodeTools1;
    const result1 = getNodeTools();
    expect(result1).toBe(mockNodeTools1);

    const mockNodeTools2 = { test: "value2" };
    (window as Window & { nodeTools?: unknown }).nodeTools = mockNodeTools2;
    const result2 = getNodeTools();
    expect(result2).toBe(mockNodeTools2);
  });

  it("should return undefined after nodeTools is deleted", () => {
    const mockNodeTools = { test: "value" };
    (window as Window & { nodeTools?: unknown }).nodeTools = mockNodeTools;
    const result1 = getNodeTools();
    expect(result1).toBe(mockNodeTools);

    delete (window as Window & { nodeTools?: unknown }).nodeTools;
    const result2 = getNodeTools();
    expect(result2).toBeUndefined();
  });
});
