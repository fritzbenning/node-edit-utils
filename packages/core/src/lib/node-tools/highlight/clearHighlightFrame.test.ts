import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "../../canvas/helpers/getCanvasContainerOrBody";
import { clearHighlightFrame } from "./clearHighlightFrame";

vi.mock("../../canvas/helpers/getCanvasContainerOrBody");

describe("clearHighlightFrame", () => {
  let container: HTMLElement;
  let highlightFrame: SVGSVGElement;
  let toolsWrapper: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    highlightFrame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    highlightFrame.classList.add("highlight-frame-overlay");
    container.appendChild(highlightFrame);

    toolsWrapper = document.createElement("div");
    toolsWrapper.classList.add("highlight-frame-tools-wrapper");
    container.appendChild(toolsWrapper);

    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.clearAllMocks();
  });

  it("should remove highlight frame overlay", () => {
    clearHighlightFrame();

    expect(container.querySelector(".highlight-frame-overlay")).toBeNull();
  });

  it("should remove tools wrapper", () => {
    clearHighlightFrame();

    expect(container.querySelector(".highlight-frame-tools-wrapper")).toBeNull();
  });

  it("should remove both frame and tools wrapper", () => {
    clearHighlightFrame();

    expect(container.querySelector(".highlight-frame-overlay")).toBeNull();
    expect(container.querySelector(".highlight-frame-tools-wrapper")).toBeNull();
  });

  it("should not throw when frame does not exist", () => {
    container.removeChild(highlightFrame);

    expect(() => {
      clearHighlightFrame();
    }).not.toThrow();
  });

  it("should not throw when tools wrapper does not exist", () => {
    container.removeChild(toolsWrapper);

    expect(() => {
      clearHighlightFrame();
    }).not.toThrow();
  });

  it("should not throw when neither exists", () => {
    container.removeChild(highlightFrame);
    container.removeChild(toolsWrapper);

    expect(() => {
      clearHighlightFrame();
    }).not.toThrow();
  });

  it("should only remove highlight frame overlay elements", () => {
    const otherElement = document.createElement("div");
    otherElement.classList.add("other-element");
    container.appendChild(otherElement);

    clearHighlightFrame();

    expect(container.querySelector(".other-element")).toBe(otherElement);
    expect(container.querySelector(".highlight-frame-overlay")).toBeNull();
  });
});
