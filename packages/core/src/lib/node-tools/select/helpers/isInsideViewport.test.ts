import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isInsideViewport } from "./isInsideViewport";

describe("isInsideViewport", () => {
  let nodeProvider: HTMLElement;
  let viewport: HTMLElement;
  let element: HTMLElement;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    viewport = document.createElement("div");
    viewport.classList.add("viewport");
    nodeProvider.appendChild(viewport);

    element = document.createElement("div");
    viewport.appendChild(element);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
  });

  it("should return true when element is inside viewport", () => {
    const result = isInsideViewport(element);

    expect(result).toBe(true);
  });

  it("should return true when element is nested inside viewport", () => {
    const nested = document.createElement("div");
    element.appendChild(nested);

    const result = isInsideViewport(nested);

    expect(result).toBe(true);
  });

  it("should return false when element is not inside viewport", () => {
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const result = isInsideViewport(outsideElement);

    expect(result).toBe(false);
    document.body.removeChild(outsideElement);
  });

  it("should stop at node-provider", () => {
    const elementOutsideViewport = document.createElement("div");
    nodeProvider.appendChild(elementOutsideViewport);

    const result = isInsideViewport(elementOutsideViewport);

    expect(result).toBe(false);
  });

  it("should return false when element is direct child of node-provider", () => {
    const directChild = document.createElement("div");
    nodeProvider.appendChild(directChild);

    const result = isInsideViewport(directChild);

    expect(result).toBe(false);
  });

  it("should handle multiple viewports", () => {
    const viewport2 = document.createElement("div");
    viewport2.classList.add("viewport");
    nodeProvider.appendChild(viewport2);
    const element2 = document.createElement("div");
    viewport2.appendChild(element2);

    expect(isInsideViewport(element)).toBe(true);
    expect(isInsideViewport(element2)).toBe(true);
  });
});

