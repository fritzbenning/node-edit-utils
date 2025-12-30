import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getViewportDimensionsModule from "../../helpers/getViewportDimensions";
import * as getViewportLabelOverlayModule from "./getViewportLabelOverlay";
import * as isViewportDraggingModule from "./isViewportDragging";
import * as refreshViewportLabelModule from "./refreshViewportLabel";
import { refreshViewportLabels } from "./refreshViewportLabels";

vi.mock("./getViewportLabelOverlay");
vi.mock("../../helpers/getViewportDimensions");
vi.mock("./refreshViewportLabel");
vi.mock("./isViewportDragging");

describe("refreshViewportLabels", () => {
  let overlay: SVGSVGElement;

  beforeEach(() => {
    overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.classList.add("viewport-labels-overlay");
    document.body.appendChild(overlay);

    vi.mocked(getViewportLabelOverlayModule.getViewportLabelOverlay).mockReturnValue(overlay);
    vi.mocked(getViewportDimensionsModule.getViewportDimensions).mockReturnValue({
      width: 1920,
      height: 1080,
    });
    vi.mocked(isViewportDraggingModule.isViewportDragging).mockReturnValue(false);
    vi.mocked(refreshViewportLabelModule.refreshViewportLabel).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.removeChild(overlay);
    vi.clearAllMocks();
  });

  it("should skip refresh when viewport is being dragged", () => {
    vi.mocked(isViewportDraggingModule.isViewportDragging).mockReturnValue(true);

    refreshViewportLabels();

    expect(refreshViewportLabelModule.refreshViewportLabel).not.toHaveBeenCalled();
  });

  it("should update SVG dimensions", () => {
    refreshViewportLabels();

    expect(overlay.getAttribute("width")).toBe("1920");
    expect(overlay.getAttribute("height")).toBe("1080");
  });

  it("should refresh labels for all viewports with data-viewport-name", () => {
    const viewport1 = document.createElement("div");
    viewport1.classList.add("viewport");
    viewport1.setAttribute("data-viewport-name", "viewport-1");
    document.body.appendChild(viewport1);

    const viewport2 = document.createElement("div");
    viewport2.classList.add("viewport");
    viewport2.setAttribute("data-viewport-name", "viewport-2");
    document.body.appendChild(viewport2);

    const viewport3 = document.createElement("div");
    viewport3.classList.add("viewport");
    // No data-viewport-name
    document.body.appendChild(viewport3);

    refreshViewportLabels();

    expect(refreshViewportLabelModule.refreshViewportLabel).toHaveBeenCalledTimes(2);
    expect(refreshViewportLabelModule.refreshViewportLabel).toHaveBeenCalledWith(viewport1);
    expect(refreshViewportLabelModule.refreshViewportLabel).toHaveBeenCalledWith(viewport2);

    document.body.removeChild(viewport1);
    document.body.removeChild(viewport2);
    document.body.removeChild(viewport3);
  });

  it("should remove labels for viewports that no longer exist", () => {
    const existingGroup1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    existingGroup1.classList.add("viewport-label-group");
    existingGroup1.setAttribute("data-viewport-name", "viewport-1");
    overlay.appendChild(existingGroup1);

    const existingGroup2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    existingGroup2.classList.add("viewport-label-group");
    existingGroup2.setAttribute("data-viewport-name", "viewport-2");
    overlay.appendChild(existingGroup2);

    // Only viewport-1 exists in DOM
    const viewport1 = document.createElement("div");
    viewport1.classList.add("viewport");
    viewport1.setAttribute("data-viewport-name", "viewport-1");
    document.body.appendChild(viewport1);

    refreshViewportLabels();

    expect(overlay.querySelector(`[data-viewport-name="viewport-1"]`)).not.toBeNull();
    expect(overlay.querySelector(`[data-viewport-name="viewport-2"]`)).toBeNull();

    document.body.removeChild(viewport1);
  });

  it("should handle empty viewport list", () => {
    refreshViewportLabels();

    expect(refreshViewportLabelModule.refreshViewportLabel).not.toHaveBeenCalled();
  });
});
