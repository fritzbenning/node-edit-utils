import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import * as toggleClassModule from "@/lib/helpers/toggleClass";
import * as isComponentInstanceModule from "../select/helpers/isComponentInstance";
import * as createHighlightFrameModule from "./createHighlightFrame";
import * as createToolsContainerModule from "./createToolsContainer";
import * as getHighlightFrameElementModule from "./helpers/getHighlightFrameElement";
import * as getScreenBoundsModule from "./helpers/getScreenBounds";
import { highlightNode } from "./highlightNode";

vi.mock("@/lib/canvas/helpers/getCanvasContainerOrBody");
vi.mock("@/lib/helpers/toggleClass");
vi.mock("../select/helpers/isComponentInstance");
vi.mock("./createHighlightFrame");
vi.mock("./createToolsContainer");
vi.mock("./helpers/getHighlightFrameElement");
vi.mock("./helpers/getScreenBounds");

describe("highlightNode", () => {
  let node: HTMLElement;
  let container: HTMLElement;
  let existingFrame: SVGSVGElement;
  let existingToolsWrapper: HTMLElement;
  let newFrame: SVGSVGElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    document.body.appendChild(node);

    container = document.createElement("div");
    document.body.appendChild(container);

    existingFrame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    existingFrame.classList.add("highlight-frame-overlay");
    container.appendChild(existingFrame);

    existingToolsWrapper = document.createElement("div");
    existingToolsWrapper.classList.add("highlight-frame-tools-wrapper");
    container.appendChild(existingToolsWrapper);

    newFrame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newFrame.classList.add("highlight-frame-overlay");

    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(existingFrame);
    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(false);
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 300,
      height: 400,
    });
    vi.mocked(createHighlightFrameModule.createHighlightFrame).mockReturnValue(newFrame);
    vi.mocked(toggleClassModule.toggleClass).mockImplementation(() => {});
    vi.mocked(createToolsContainerModule.createToolsContainer).mockImplementation(() => {});
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.clearAllMocks();
  });

  it("should do nothing when node is null", () => {
    highlightNode(null);

    expect(createHighlightFrameModule.createHighlightFrame).not.toHaveBeenCalled();
  });

  it("should remove existing highlight frame", () => {
    highlightNode(node);

    expect(existingFrame.parentNode).toBeNull();
  });

  it("should remove existing tools wrapper", () => {
    highlightNode(node);

    expect(existingToolsWrapper.parentNode).toBeNull();
  });

  it("should create new highlight frame", () => {
    highlightNode(node);

    expect(createHighlightFrameModule.createHighlightFrame).toHaveBeenCalledWith(node, false, false);
  });

  it("should create highlight frame with instance flag", () => {
    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(true);

    highlightNode(node);

    expect(createHighlightFrameModule.createHighlightFrame).toHaveBeenCalledWith(node, true, false);
  });

  it("should create highlight frame with text edit flag", () => {
    node.contentEditable = "true";

    highlightNode(node);

    expect(createHighlightFrameModule.createHighlightFrame).toHaveBeenCalledWith(node, false, true);
  });

  it("should add is-editable class when node is contentEditable", () => {
    node.contentEditable = "true";

    highlightNode(node);

    expect(newFrame.classList.contains("is-editable")).toBe(true);
  });

  it("should create tools wrapper with correct styles", () => {
    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect(toolsWrapper).not.toBeNull();
    expect((toolsWrapper as HTMLElement).style.position).toBe("absolute");
    expect((toolsWrapper as HTMLElement).style.transform).toBe("translate(200px, 500px)");
    expect((toolsWrapper as HTMLElement).style.transformOrigin).toBe("left center");
    expect((toolsWrapper as HTMLElement).style.pointerEvents).toBe("none");
    expect((toolsWrapper as HTMLElement).style.zIndex).toBe("500");
  });

  it("should toggle classes on tools wrapper", () => {
    highlightNode(node);

    expect(toggleClassModule.toggleClass).toHaveBeenCalled();
  });

  it("should create tools container", () => {
    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect(createToolsContainerModule.createToolsContainer).toHaveBeenCalledWith(
      node,
      toolsWrapper as HTMLElement,
      false,
      false
    );
  });

  it("should append tools wrapper to container", () => {
    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect(toolsWrapper?.parentNode).toBe(container);
  });

  it("should handle instance node", () => {
    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(true);

    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect(createToolsContainerModule.createToolsContainer).toHaveBeenCalledWith(
      node,
      toolsWrapper as HTMLElement,
      true,
      false
    );
  });

  it("should handle text edit node", () => {
    node.contentEditable = "true";

    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect(createToolsContainerModule.createToolsContainer).toHaveBeenCalledWith(
      node,
      toolsWrapper as HTMLElement,
      false,
      true
    );
  });

  it("should calculate bottomY correctly", () => {
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 50,
      left: 100,
      width: 200,
      height: 150,
    });

    highlightNode(node);

    const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
    expect((toolsWrapper as HTMLElement).style.transform).toBe("translate(100px, 200px)");
  });

  it("should work when no existing frame exists", () => {
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(null);
    container.removeChild(existingFrame);

    expect(() => {
      highlightNode(node);
    }).not.toThrow();
  });

  it("should work when no existing tools wrapper exists", () => {
    container.removeChild(existingToolsWrapper);

    expect(() => {
      highlightNode(node);
    }).not.toThrow();
  });
});

