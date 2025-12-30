import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getScreenBoundsModule from "../../node-tools/highlight/helpers/getScreenBounds";
import * as getViewportLabelOverlayModule from "./getViewportLabelOverlay";
import { refreshViewportLabel } from "./refreshViewportLabel";
import * as setupViewportDragModule from "./setupViewportDrag";

vi.mock("./getViewportLabelOverlay");
vi.mock("../../node-tools/highlight/helpers/getScreenBounds");
vi.mock("./setupViewportDrag");

describe("refreshViewportLabel", () => {
  let overlay: SVGSVGElement;
  let viewportElement: HTMLElement;

  beforeEach(() => {
    overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.classList.add("viewport-labels-overlay");
    document.body.appendChild(overlay);

    viewportElement = document.createElement("div");
    viewportElement.classList.add("viewport");
    viewportElement.setAttribute("data-viewport-name", "test-viewport");
    document.body.appendChild(viewportElement);

    vi.mocked(getViewportLabelOverlayModule.getViewportLabelOverlay).mockReturnValue(overlay);
    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 100,
      left: 200,
      width: 400,
      height: 300,
    });
    vi.mocked(setupViewportDragModule.setupViewportDrag).mockReturnValue(() => {});
  });

  afterEach(() => {
    document.body.removeChild(overlay);
    document.body.removeChild(viewportElement);
    vi.clearAllMocks();
  });

  it("should do nothing when viewport name is not set", () => {
    viewportElement.removeAttribute("data-viewport-name");

    refreshViewportLabel(viewportElement);

    expect(getViewportLabelOverlayModule.getViewportLabelOverlay).not.toHaveBeenCalled();
  });

  it("should create new label group when it doesn't exist", () => {
    refreshViewportLabel(viewportElement);

    const group = overlay.querySelector(`[data-viewport-name="test-viewport"]`) as SVGGElement | null;
    expect(group).not.toBeNull();
    expect(group?.classList.contains("viewport-label-group")).toBe(true);
  });

  it("should create text element with correct attributes", () => {
    refreshViewportLabel(viewportElement);

    const group = overlay.querySelector(`[data-viewport-name="test-viewport"]`) as SVGGElement | null;
    const text = group?.querySelector("text");
    expect(text).not.toBeNull();
    expect(text?.classList.contains("viewport-label-text")).toBe(true);
    expect(text?.getAttribute("x")).toBe("0");
    expect(text?.getAttribute("y")).toBe("-8");
    expect(text?.getAttribute("vector-effect")).toBe("non-scaling-stroke");
    expect(text?.getAttribute("pointer-events")).toBe("auto");
    expect(text?.textContent).toBe("test-viewport");
  });

  it("should set up drag functionality when creating new label", () => {
    refreshViewportLabel(viewportElement);

    const group = overlay.querySelector(`[data-viewport-name="test-viewport"]`) as SVGGElement | null;
    const text = group?.querySelector("text") as SVGTextElement | null;

    expect(setupViewportDragModule.setupViewportDrag).toHaveBeenCalledWith(text, viewportElement, "test-viewport");
  });

  it("should update label position when group already exists", () => {
    // Create existing group
    const existingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    existingGroup.setAttribute("data-viewport-name", "test-viewport");
    existingGroup.setAttribute("transform", "translate(0, 0)");
    overlay.appendChild(existingGroup);

    vi.mocked(getScreenBoundsModule.getScreenBounds).mockReturnValue({
      top: 150,
      left: 250,
      width: 400,
      height: 300,
    });

    refreshViewportLabel(viewportElement);

    expect(existingGroup.getAttribute("transform")).toBe("translate(250, 150)");
    expect(setupViewportDragModule.setupViewportDrag).not.toHaveBeenCalled();
  });

  it("should use screen bounds to position label", () => {
    refreshViewportLabel(viewportElement);

    expect(getScreenBoundsModule.getScreenBounds).toHaveBeenCalledWith(viewportElement);
  });
});
