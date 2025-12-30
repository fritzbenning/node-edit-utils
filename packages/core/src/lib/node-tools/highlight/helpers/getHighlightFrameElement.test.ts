import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import { getHighlightFrameElement } from "./getHighlightFrameElement";

vi.mock("@/lib/canvas/helpers/getCanvasContainerOrBody");

describe("getHighlightFrameElement", () => {
  let container: HTMLElement;
  let highlightFrame: SVGSVGElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    highlightFrame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    highlightFrame.classList.add("highlight-frame-overlay");
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.clearAllMocks();
  });

  it("should return highlight frame element when it exists", () => {
    container.appendChild(highlightFrame);
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);

    const result = getHighlightFrameElement();

    expect(result).toBe(highlightFrame);
  });

  it("should return null when highlight frame does not exist", () => {
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);

    const result = getHighlightFrameElement();

    expect(result).toBeNull();
  });

  it("should return first highlight frame when multiple exist", () => {
    const frame1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    frame1.classList.add("highlight-frame-overlay");
    const frame2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    frame2.classList.add("highlight-frame-overlay");
    container.appendChild(frame1);
    container.appendChild(frame2);
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);

    const result = getHighlightFrameElement();

    expect(result).toBe(frame1);
  });

  it("should return null after frame is removed", () => {
    container.appendChild(highlightFrame);
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);

    const result1 = getHighlightFrameElement();
    expect(result1).toBe(highlightFrame);

    container.removeChild(highlightFrame);
    const result2 = getHighlightFrameElement();
    expect(result2).toBeNull();
  });

  it("should return SVG element", () => {
    container.appendChild(highlightFrame);
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);

    const result = getHighlightFrameElement();

    expect(result).toBeInstanceOf(SVGSVGElement);
  });
});

