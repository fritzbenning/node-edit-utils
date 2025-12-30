import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import * as getCanvasWindowValueModule from "@/lib/canvas/helpers/getCanvasWindowValue";
import * as getViewportDimensionsModule from "@/lib/helpers/getViewportDimensions";
import * as toggleClassModule from "@/lib/helpers/toggleClass";
import * as isComponentInstanceModule from "../select/helpers/isComponentInstance";
import * as getHighlightFrameElementModule from "./helpers/getHighlightFrameElement";
import * as getScreenBoundsModule from "./helpers/getScreenBounds";
import { refreshHighlightFrame } from "./refreshHighlightFrame";

vi.mock("@/lib/canvas/helpers/getCanvasContainerOrBody");
vi.mock("@/lib/canvas/helpers/getCanvasWindowValue");
vi.mock("@/lib/helpers/getViewportDimensions");
vi.mock("@/lib/helpers/toggleClass");
vi.mock("../select/helpers/isComponentInstance");
vi.mock("./helpers/getHighlightFrameElement");
vi.mock("./helpers/getScreenBounds");

describe("refreshHighlightFrame", () => {
  let node: HTMLElement;
  let nodeProvider: HTMLElement;
  let container: HTMLElement;
  let frame: SVGSVGElement;
  let group: SVGGElement;
  let rect: SVGRectElement;
  let toolsWrapper: HTMLElement;
  let nodeTools: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    document.body.appendChild(node);

    nodeProvider = document.createElement("div");
    document.body.appendChild(nodeProvider);

    container = document.createElement("div");
    document.body.appendChild(container);

    frame = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    frame.classList.add("highlight-frame-overlay");
    container.appendChild(frame);

    group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("highlight-frame-group");
    frame.appendChild(group);

    rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    group.appendChild(rect);

    toolsWrapper = document.createElement("div");
    toolsWrapper.classList.add("highlight-frame-tools-wrapper");
    container.appendChild(toolsWrapper);

    nodeTools = document.createElement("div");
    nodeTools.classList.add("node-tools");
    toolsWrapper.appendChild(nodeTools);

    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(frame);
    vi.mocked(getViewportDimensionsModule.getViewportDimensions).mockReturnValue({
      width: 1920,
      height: 1080,
    });
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 300,
      height: 400,
    });
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1);
    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(false);
    vi.mocked(toggleClassModule.toggleClass).mockImplementation(() => {});
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.clearAllMocks();
  });

  it("should do nothing when frame does not exist", () => {
    vi.mocked(getHighlightFrameElementModule.getHighlightFrameElement).mockReturnValue(null);

    expect(() => {
      refreshHighlightFrame(node, nodeProvider);
    }).not.toThrow();
  });

  it("should update SVG dimensions", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(frame.getAttribute("width")).toBe("1920");
    expect(frame.getAttribute("height")).toBe("1080");
  });

  it("should toggle is-instance class", () => {
    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(true);

    refreshHighlightFrame(node, nodeProvider);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(frame, "is-instance", true);
  });

  it("should toggle is-text-edit class", () => {
    node.contentEditable = "true";

    refreshHighlightFrame(node, nodeProvider);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(frame, "is-text-edit", true);
  });

  it("should update group transform", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(group.getAttribute("transform")).toBe("translate(200, 100)");
  });

  it("should update rect dimensions", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(rect.getAttribute("width")).toBe("300");
    expect(rect.getAttribute("height")).toBe("400");
  });

  it("should ensure minimum width of 3", () => {
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 1,
      height: 400,
    });

    refreshHighlightFrame(node, nodeProvider);

    expect(rect.getAttribute("width")).toBe("3");
  });

  it("should apply instance color when isInstance is true", () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--component-color") return "rgb(255, 0, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(true);

    refreshHighlightFrame(node, nodeProvider);

    expect(rect.getAttribute("stroke")).toBe("rgb(255, 0, 0)");

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should apply text edit color when isTextEdit is true", () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--text-edit-color") return "rgb(0, 255, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    node.contentEditable = "true";

    refreshHighlightFrame(node, nodeProvider);

    expect(rect.getAttribute("stroke")).toBe("rgb(0, 255, 0)");

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should remove stroke when neither flag is true", () => {
    rect.setAttribute("stroke", "rgb(255, 0, 0)");

    refreshHighlightFrame(node, nodeProvider);

    expect(rect.getAttribute("stroke")).toBeNull();
  });

  it("should update tools wrapper transform", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(toolsWrapper.style.transform).toBe("translate(200px, 500px)");
  });

  it("should toggle classes on tools wrapper", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(toolsWrapper, "is-instance", false);
    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(toolsWrapper, "is-text-edit", false);
  });

  it("should toggle classes on node tools", () => {
    refreshHighlightFrame(node, nodeProvider);

    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(nodeTools, "is-instance", false);
    expect(toggleClassModule.toggleClass).toHaveBeenCalledWith(nodeTools, "is-text-edit", false);
  });

  it("should update tool opacity when zoom <= 10", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(5);

    refreshHighlightFrame(node, nodeProvider);

    expect(nodeProvider.style.getPropertyValue("--tool-opacity")).toBe("1");
  });

  it("should set tool opacity to 0 when zoom > 10", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(15);

    refreshHighlightFrame(node, nodeProvider);

    expect(nodeProvider.style.getPropertyValue("--tool-opacity")).toBe("0");
  });

  it("should use default zoom of 1 when zoom is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    refreshHighlightFrame(node, nodeProvider);

    expect(nodeProvider.style.getPropertyValue("--tool-opacity")).toBe("1");
  });

  it("should use custom canvas name", () => {
    refreshHighlightFrame(node, nodeProvider, "custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["zoom", "current"], "custom-canvas");
  });

  it("should update corner handle positions", () => {
    const topLeft = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    topLeft.classList.add("handle-top-left");
    group.appendChild(topLeft);

    refreshHighlightFrame(node, nodeProvider);

    expect(topLeft.getAttribute("x")).toBe("-3");
    expect(topLeft.getAttribute("y")).toBe("-3");
  });

  it("should update all corner handles", () => {
    const topLeft = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    topLeft.classList.add("handle-top-left");
    const topRight = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    topRight.classList.add("handle-top-right");
    const bottomRight = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bottomRight.classList.add("handle-bottom-right");
    const bottomLeft = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bottomLeft.classList.add("handle-bottom-left");
    group.appendChild(topLeft);
    group.appendChild(topRight);
    group.appendChild(bottomRight);
    group.appendChild(bottomLeft);

    refreshHighlightFrame(node, nodeProvider);

    expect(topLeft.getAttribute("x")).toBe("-3");
    expect(topLeft.getAttribute("y")).toBe("-3");
    expect(topRight.getAttribute("x")).toBe("297");
    expect(topRight.getAttribute("y")).toBe("-3");
    expect(bottomRight.getAttribute("x")).toBe("297");
    expect(bottomRight.getAttribute("y")).toBe("397");
    expect(bottomLeft.getAttribute("x")).toBe("-3");
    expect(bottomLeft.getAttribute("y")).toBe("397");
  });

  it("should update handle colors for instance", () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--component-color") return "rgb(255, 0, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    const handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    handle.classList.add("handle-top-left");
    group.appendChild(handle);

    vi.mocked(isComponentInstanceModule.isComponentInstance).mockReturnValue(true);

    refreshHighlightFrame(node, nodeProvider);

    expect(handle.getAttribute("stroke")).toBe("rgb(255, 0, 0)");

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should not update when group does not exist", () => {
    group.remove();

    expect(() => {
      refreshHighlightFrame(node, nodeProvider);
    }).not.toThrow();
  });

  it("should not update when rect does not exist", () => {
    rect.remove();

    expect(() => {
      refreshHighlightFrame(node, nodeProvider);
    }).not.toThrow();
  });

  it("should not update tools wrapper when it does not exist", () => {
    container.removeChild(toolsWrapper);

    expect(() => {
      refreshHighlightFrame(node, nodeProvider);
    }).not.toThrow();
  });
});

