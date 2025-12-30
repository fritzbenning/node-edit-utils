import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerOrBodyModule from "../../canvas/helpers/getCanvasContainerOrBody";
import * as getViewportDimensionsModule from "../../helpers/getViewportDimensions";
import { getViewportLabelOverlay } from "./getViewportLabelOverlay";

vi.mock("../../canvas/helpers/getCanvasContainerOrBody");
vi.mock("../../helpers/getViewportDimensions");

describe("getViewportLabelOverlay", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.mocked(getCanvasContainerOrBodyModule.getCanvasContainerOrBody).mockReturnValue(container);
    vi.mocked(getViewportDimensionsModule.getViewportDimensions).mockReturnValue({
      width: 1920,
      height: 1080,
    });
  });

  afterEach(() => {
    // Clean up any overlays
    const overlays = container.querySelectorAll(".viewport-labels-overlay");
    overlays.forEach((overlay) => {
      overlay.remove();
    });
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it("should create a new SVG overlay if it doesn't exist", () => {
    const overlay = getViewportLabelOverlay();

    expect(overlay).toBeInstanceOf(SVGSVGElement);
    expect(overlay.classList.contains("viewport-labels-overlay")).toBe(true);
    expect(container.contains(overlay)).toBe(true);
  });

  it("should return existing overlay if it already exists", () => {
    const overlay1 = getViewportLabelOverlay();
    const overlay2 = getViewportLabelOverlay();

    expect(overlay1).toBe(overlay2);
  });

  it("should set correct SVG attributes", () => {
    const overlay = getViewportLabelOverlay();

    expect(overlay.getAttribute("width")).toBe("1920");
    expect(overlay.getAttribute("height")).toBe("1080");
  });

  it("should set correct CSS styles", () => {
    const overlay = getViewportLabelOverlay();

    expect(overlay.style.position).toBe("absolute");
    expect(overlay.style.top).toBe("0px");
    expect(overlay.style.left).toBe("0px");
    expect(overlay.style.width).toBe("100vw");
    expect(overlay.style.height).toBe("100vh");
    expect(overlay.style.pointerEvents).toBe("none");
    expect(overlay.style.zIndex).toBe("500");
  });

  it("should use viewport dimensions from getViewportDimensions", () => {
    vi.mocked(getViewportDimensionsModule.getViewportDimensions).mockReturnValue({
      width: 2560,
      height: 1440,
    });

    const overlay = getViewportLabelOverlay();

    expect(overlay.getAttribute("width")).toBe("2560");
    expect(overlay.getAttribute("height")).toBe("1440");
  });
});
