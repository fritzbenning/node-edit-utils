import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as adjustForZoomModule from "@/lib/helpers/adjustForZoom";
import * as getCanvasWindowValueModule from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getElementBounds } from "./getElementBounds";

vi.mock("@/lib/helpers/adjustForZoom");
vi.mock("@/lib/canvas/helpers/getCanvasWindowValue");

describe("getElementBounds", () => {
  let element: HTMLElement;
  let nodeProvider: HTMLElement;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.style.position = "relative";
    nodeProvider.style.left = "100px";
    nodeProvider.style.top = "200px";
    document.body.appendChild(nodeProvider);

    element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "50px";
    element.style.top = "75px";
    element.style.width = "200px";
    element.style.height = "150px";
    nodeProvider.appendChild(element);

    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1);
    vi.mocked(adjustForZoomModule.adjustForZoom).mockImplementation((value) => value);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should calculate relative bounds", () => {
    const result = getElementBounds(element, nodeProvider);

    expect(result).toHaveProperty("top");
    expect(result).toHaveProperty("left");
    expect(result).toHaveProperty("width");
    expect(result).toHaveProperty("height");
    expect(typeof result.top).toBe("number");
    expect(typeof result.left).toBe("number");
    expect(typeof result.width).toBe("number");
    expect(typeof result.height).toBe("number");
  });

  it("should adjust bounds for zoom", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(2);
    vi.mocked(adjustForZoomModule.adjustForZoom).mockImplementation((value) => value / 2);

    const result = getElementBounds(element, nodeProvider);

    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalled();
  });

  it("should use default zoom of 1 when zoom is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    getElementBounds(element, nodeProvider);

    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalled();
  });

  it("should ensure minimum width of 4", () => {
    element.style.width = "2px";
    vi.mocked(adjustForZoomModule.adjustForZoom).mockImplementation((value) => {
      // Return very small width
      if (value < 10) return 2;
      return value;
    });

    const result = getElementBounds(element, nodeProvider);

    expect(result.width).toBeGreaterThanOrEqual(4);
  });

  it("should use custom canvas name", () => {
    getElementBounds(element, nodeProvider, "custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["zoom", "current"], "custom-canvas");
  });

  it("should calculate relative position correctly", () => {
    const elementRect = {
      top: 275,
      left: 150,
      width: 200,
      height: 150,
      bottom: 425,
      right: 350,
      x: 150,
      y: 275,
      toJSON: vi.fn(),
    };
    const providerRect = {
      top: 200,
      left: 100,
      width: 500,
      height: 400,
      bottom: 600,
      right: 600,
      x: 100,
      y: 200,
      toJSON: vi.fn(),
    };

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(elementRect as DOMRect);
    vi.spyOn(nodeProvider, "getBoundingClientRect").mockReturnValue(providerRect as DOMRect);

    const result = getElementBounds(element, nodeProvider);

    // Relative top = 275 - 200 = 75
    // Relative left = 150 - 100 = 50
    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalledWith(75, expect.any(Number));
    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalledWith(50, expect.any(Number));
  });

  it("should handle negative relative positions", () => {
    const elementRect = {
      top: 150,
      left: 50,
      width: 200,
      height: 150,
      bottom: 300,
      right: 250,
      x: 50,
      y: 150,
      toJSON: vi.fn(),
    };
    const providerRect = {
      top: 200,
      left: 100,
      width: 500,
      height: 400,
      bottom: 600,
      right: 600,
      x: 100,
      y: 200,
      toJSON: vi.fn(),
    };

    vi.spyOn(element, "getBoundingClientRect").mockReturnValue(elementRect as DOMRect);
    vi.spyOn(nodeProvider, "getBoundingClientRect").mockReturnValue(providerRect as DOMRect);

    const result = getElementBounds(element, nodeProvider);

    // Relative top = 150 - 200 = -50
    // Relative left = 50 - 100 = -50
    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalledWith(-50, expect.any(Number));
    expect(adjustForZoomModule.adjustForZoom).toHaveBeenCalledWith(-50, expect.any(Number));
  });
});

