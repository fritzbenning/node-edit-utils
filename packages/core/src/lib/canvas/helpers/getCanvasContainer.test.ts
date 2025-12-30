import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getCanvasContainer } from "./getCanvasContainer";

describe("getCanvasContainer", () => {
  let canvasContainer: HTMLElement;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvas-container");
  });

  afterEach(() => {
    if (document.body.contains(canvasContainer)) {
      document.body.removeChild(canvasContainer);
    }
    // Remove any other canvas containers that might exist
    const existingContainers = document.querySelectorAll(".canvas-container");
    existingContainers.forEach((container) => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });
  });

  it("should return canvas container element when it exists", () => {
    document.body.appendChild(canvasContainer);

    const result = getCanvasContainer();

    expect(result).toBe(canvasContainer);
  });

  it("should return null when canvas container does not exist", () => {
    const result = getCanvasContainer();

    expect(result).toBeNull();
  });

  it("should return first canvas container when multiple exist", () => {
    const firstContainer = document.createElement("div");
    firstContainer.classList.add("canvas-container");
    const secondContainer = document.createElement("div");
    secondContainer.classList.add("canvas-container");

    document.body.appendChild(firstContainer);
    document.body.appendChild(secondContainer);

    const result = getCanvasContainer();

    expect(result).toBe(firstContainer);
  });

  it("should return null after container is removed", () => {
    document.body.appendChild(canvasContainer);
    const result1 = getCanvasContainer();
    expect(result1).toBe(canvasContainer);

    document.body.removeChild(canvasContainer);
    const result2 = getCanvasContainer();
    expect(result2).toBeNull();
  });
});
