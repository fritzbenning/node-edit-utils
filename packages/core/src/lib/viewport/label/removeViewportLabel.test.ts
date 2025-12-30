import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getViewportLabelOverlayModule from "./getViewportLabelOverlay";
import { removeViewportLabel } from "./removeViewportLabel";

vi.mock("./getViewportLabelOverlay");

describe("removeViewportLabel", () => {
  let overlay: SVGSVGElement;
  let viewportElement: HTMLElement;

  beforeEach(() => {
    overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    overlay.classList.add("viewport-labels-overlay");
    document.body.appendChild(overlay);

    viewportElement = document.createElement("div");
    viewportElement.setAttribute("data-viewport-name", "test-viewport");
    document.body.appendChild(viewportElement);

    vi.mocked(getViewportLabelOverlayModule.getViewportLabelOverlay).mockReturnValue(overlay);
  });

  afterEach(() => {
    document.body.removeChild(overlay);
    document.body.removeChild(viewportElement);
    vi.clearAllMocks();
  });

  it("should remove label group when viewport name exists", () => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-viewport-name", "test-viewport");
    overlay.appendChild(group);

    removeViewportLabel(viewportElement);

    expect(overlay.querySelector(`[data-viewport-name="test-viewport"]`)).toBeNull();
  });

  it("should do nothing when viewport name doesn't exist", () => {
    viewportElement.removeAttribute("data-viewport-name");

    expect(() => {
      removeViewportLabel(viewportElement);
    }).not.toThrow();
  });

  it("should do nothing when label group doesn't exist", () => {
    removeViewportLabel(viewportElement);

    expect(overlay.querySelector(`[data-viewport-name="test-viewport"]`)).toBeNull();
  });

  it("should only remove the matching label group", () => {
    const group1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group1.setAttribute("data-viewport-name", "test-viewport");
    overlay.appendChild(group1);

    const group2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group2.setAttribute("data-viewport-name", "other-viewport");
    overlay.appendChild(group2);

    removeViewportLabel(viewportElement);

    expect(overlay.querySelector(`[data-viewport-name="test-viewport"]`)).toBeNull();
    expect(overlay.querySelector(`[data-viewport-name="other-viewport"]`)).toBe(group2);
  });
});
