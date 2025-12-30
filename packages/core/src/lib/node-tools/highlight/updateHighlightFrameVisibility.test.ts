import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import * as getHighlightFrameElementModule from "./helpers/getHighlightFrameElement";
import { updateHighlightFrameVisibility } from "./updateHighlightFrameVisibility";

vi.mock("@/lib/canvas/helpers/getCanvasContainerOrBody");
vi.mock("./helpers/getHighlightFrameElement");

describe("updateHighlightFrameVisibility", () => {
  let container: HTMLElement;
  let frame: SVGSVGElement;
  let toolsWrapper: HTMLElement;
  let node: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    frame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    frame.classList.add("highlight-frame-overlay");
    container.appendChild(frame);

    toolsWrapper = document.createElement("div");
    toolsWrapper.classList.add("highlight-frame-tools-wrapper");
    container.appendChild(toolsWrapper);

    node = document.createElement("div");
    document.body.appendChild(node);

    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(frame);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    vi.clearAllMocks();
  });

  it("should set display to empty string when node is visible", () => {
    updateHighlightFrameVisibility(node);

    expect(frame.style.display).toBe("");
    expect(toolsWrapper.style.display).toBe("");
  });

  it("should set display to none when node has hidden class", () => {
    node.classList.add("hidden");

    updateHighlightFrameVisibility(node);

    expect(frame.style.display).toBe("none");
    expect(toolsWrapper.style.display).toBe("none");
  });

  it("should set display to none when node has select-none class", () => {
    node.classList.add("select-none");

    updateHighlightFrameVisibility(node);

    expect(frame.style.display).toBe("none");
    expect(toolsWrapper.style.display).toBe("none");
  });

  it("should set display to none when node has both hidden and select-none classes", () => {
    node.classList.add("hidden");
    node.classList.add("select-none");

    updateHighlightFrameVisibility(node);

    expect(frame.style.display).toBe("none");
    expect(toolsWrapper.style.display).toBe("none");
  });

  it("should not update when frame does not exist", () => {
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(null);

    expect(() => {
      updateHighlightFrameVisibility(node);
    }).not.toThrow();

    expect(toolsWrapper.style.display).toBe("");
  });

  it("should not update tools wrapper when it does not exist", () => {
    container.removeChild(toolsWrapper);

    updateHighlightFrameVisibility(node);

    expect(frame.style.display).toBe("");
  });

  it("should toggle visibility when classes change", () => {
    updateHighlightFrameVisibility(node);
    expect(frame.style.display).toBe("");

    node.classList.add("hidden");
    updateHighlightFrameVisibility(node);
    expect(frame.style.display).toBe("none");

    node.classList.remove("hidden");
    updateHighlightFrameVisibility(node);
    expect(frame.style.display).toBe("");
  });
});

