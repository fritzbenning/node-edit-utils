import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerModule from "./getCanvasContainer";
import { getCanvasContainerOrBody } from "./getCanvasContainerOrBody";

vi.mock("./getCanvasContainer");

describe("getCanvasContainerOrBody", () => {
  let canvasContainer: HTMLElement;

  beforeEach(() => {
    canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvas-container");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return canvas container when it exists", () => {
    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(canvasContainer);

    const result = getCanvasContainerOrBody();

    expect(result).toBe(canvasContainer);
  });

  it("should return document.body when canvas container does not exist", () => {
    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(null);

    const result = getCanvasContainerOrBody();

    expect(result).toBe(document.body);
  });

  it("should always return an HTMLElement", () => {
    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(canvasContainer);

    const result = getCanvasContainerOrBody();

    expect(result).toBeInstanceOf(HTMLElement);
  });

  it("should return document.body when canvas container is null", () => {
    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(null);

    const result = getCanvasContainerOrBody();

    expect(result).toBe(document.body);
    expect(result).toBeInstanceOf(HTMLElement);
  });
});
