import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import * as getViewportDimensionsModule from "@/lib/helpers/getViewportDimensions";
import * as getScreenBoundsModule from "./helpers/getScreenBounds";
import * as createCornerHandlesModule from "./createCornerHandles";
import { createHighlightFrame } from "./createHighlightFrame";

vi.mock("@/lib/canvas/helpers/getCanvasContainerOrBody");
vi.mock("@/lib/helpers/getViewportDimensions");
vi.mock("./helpers/getScreenBounds");
vi.mock("./createCornerHandles");

describe("createHighlightFrame", () => {
  let node: HTMLElement;
  let container: HTMLElement;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    document.body.appendChild(node);

    container = document.createElement("div");
    document.body.appendChild(container);

    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
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
    vi.mocked(createCornerHandlesModule.createCornerHandles).mockImplementation(() => {});
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

  it("should create SVG overlay element", () => {
    const result = createHighlightFrame(node);

    expect(result).toBeInstanceOf(SVGSVGElement);
    expect(result.classList.contains("highlight-frame-overlay")).toBe(true);
  });

  it("should set SVG attributes", () => {
    const result = createHighlightFrame(node);

    expect(result.getAttribute("width")).toBe("1920");
    expect(result.getAttribute("height")).toBe("1080");
  });

  it("should set SVG styles", () => {
    const result = createHighlightFrame(node);

    expect(result.style.position).toBe("absolute");
    expect(result.style.top).toBe("0px");
    expect(result.style.left).toBe("0px");
    expect(result.style.width).toBe("100vw");
    expect(result.style.height).toBe("100vh");
    expect(result.style.pointerEvents).toBe("none");
    expect(result.style.zIndex).toBe("500");
  });

  it("should add is-instance class when isInstance is true", () => {
    const result = createHighlightFrame(node, true, false);

    expect(result.classList.contains("is-instance")).toBe(true);
  });

  it("should add is-text-edit class when isTextEdit is true", () => {
    const result = createHighlightFrame(node, false, true);

    expect(result.classList.contains("is-text-edit")).toBe(true);
  });

  it("should set data-node-id attribute", () => {
    const result = createHighlightFrame(node);

    expect(result.getAttribute("data-node-id")).toBe("test-node");
  });

  it("should handle missing data-node-id", () => {
    node.removeAttribute("data-node-id");
    const result = createHighlightFrame(node);

    expect(result.getAttribute("data-node-id")).toBe("");
  });

  it("should create group element", () => {
    const result = createHighlightFrame(node);

    const group = result.querySelector(".highlight-frame-group");
    expect(group).not.toBeNull();
    expect(group?.tagName).toBe("g");
  });

  it("should set group transform", () => {
    const result = createHighlightFrame(node);

    const group = result.querySelector(".highlight-frame-group") as SVGGElement;
    expect(group.getAttribute("transform")).toBe("translate(200, 100)");
  });

  it("should create rect element", () => {
    const result = createHighlightFrame(node);

    const rect = result.querySelector("rect");
    expect(rect).not.toBeNull();
    expect(rect?.classList.contains("highlight-frame-rect")).toBe(true);
  });

  it("should set rect dimensions", () => {
    const result = createHighlightFrame(node);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("width")).toBe("300");
    expect(rect?.getAttribute("height")).toBe("400");
  });

  it("should ensure minimum width of 3", () => {
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 1,
      height: 400,
    });

    const result = createHighlightFrame(node);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("width")).toBe("3");
  });

  it("should set rect vector-effect", () => {
    const result = createHighlightFrame(node);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("vector-effect")).toBe("non-scaling-stroke");
  });

  it("should apply instance color when isInstance is true", () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--component-color") return "rgb(255, 0, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    const result = createHighlightFrame(node, true, false);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("stroke")).toBe("rgb(255, 0, 0)");

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

    const result = createHighlightFrame(node, false, true);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("stroke")).toBe("rgb(0, 255, 0)");

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should not set stroke when neither flag is true", () => {
    const result = createHighlightFrame(node, false, false);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("stroke")).toBeNull();
  });

  it("should create corner handles", () => {
    createHighlightFrame(node);

    expect(createCornerHandlesModule.createCornerHandles).toHaveBeenCalledWith(
      expect.objectContaining({ tagName: "g" }),
      300,
      400,
      false,
      false
    );
  });

  it("should append SVG to container", () => {
    const result = createHighlightFrame(node);

    expect(result.parentNode).toBe(container);
  });

  it("should use viewport dimensions", () => {
    vi.mocked(getViewportDimensionsModule.getViewportDimensions).mockReturnValue({
      width: 800,
      height: 600,
    });

    const result = createHighlightFrame(node);

    expect(result.getAttribute("width")).toBe("800");
    expect(result.getAttribute("height")).toBe("600");
  });

  it("should handle zero width with minimum", () => {
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 0,
      height: 400,
    });

    const result = createHighlightFrame(node);

    const rect = result.querySelector("rect");
    expect(rect?.getAttribute("width")).toBe("3");
  });
});

