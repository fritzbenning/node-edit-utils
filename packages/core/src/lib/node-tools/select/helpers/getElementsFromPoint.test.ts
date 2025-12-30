import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getElementsFromPoint } from "./getElementsFromPoint";

describe("getElementsFromPoint", () => {
  let nodeProvider: HTMLElement;
  let element1: HTMLElement;
  let element2: HTMLElement;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    element1 = document.createElement("div");
    element1.setAttribute("data-node-id", "node-1");
    nodeProvider.appendChild(element1);

    element2 = document.createElement("div");
    element2.setAttribute("data-node-id", "node-2");
    element1.appendChild(element2);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return elements up to node-provider", () => {
    const mockElements = [element2, element1, nodeProvider];
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue(mockElements),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([element2, element1]);
  });

  it("should return empty array when node-provider is first element", () => {
    const mockElements = [nodeProvider, element1, element2];
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue(mockElements),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([]);
  });

  it("should return all elements before node-provider", () => {
    const element3 = document.createElement("div");
    const mockElements = [element3, element2, element1, nodeProvider];
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue(mockElements),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([element3, element2, element1]);
  });

  it("should return empty array when no elements", () => {
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue([]),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([]);
  });

  it("should return all elements when node-provider is not present", () => {
    const mockElements = [element2, element1];
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue(mockElements),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([element2, element1]);
  });

  it("should handle node-provider in middle of elements", () => {
    const element3 = document.createElement("div");
    const mockElements = [element3, nodeProvider, element2, element1];
    Object.defineProperty(document, "elementsFromPoint", {
      value: vi.fn().mockReturnValue(mockElements),
      writable: true,
      configurable: true,
    });

    const result = getElementsFromPoint(100, 200);

    expect(result).toEqual([element3]);
  });
});

