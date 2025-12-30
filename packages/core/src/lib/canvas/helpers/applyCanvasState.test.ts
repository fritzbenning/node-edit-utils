import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyCanvasState } from "./applyCanvasState";
import * as getCanvasWindowValueModule from "./getCanvasWindowValue";

vi.mock("./getCanvasWindowValue");

describe("applyCanvasState", () => {
  beforeEach(() => {
    // Clear body styles and data attributes
    document.body.style.removeProperty("--zoom");
    document.body.style.removeProperty("--stroke-width");
    delete document.body.dataset.zoom;
    delete document.body.dataset.strokeWidth;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.removeProperty("--zoom");
    document.body.style.removeProperty("--stroke-width");
    delete document.body.dataset.zoom;
    delete document.body.dataset.strokeWidth;
  });

  it("should set zoom and stroke-width CSS variables", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("1.00000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("2.000");
  });

  it("should set zoom and stroke-width data attributes", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1);

    applyCanvasState();

    expect(document.body.dataset.zoom).toBe("1.00000");
    expect(document.body.dataset.strokeWidth).toBe("2.000");
  });

  it("should use default zoom of 1 when zoom is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("1.00000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("2.000");
    expect(document.body.dataset.zoom).toBe("1.00000");
    expect(document.body.dataset.strokeWidth).toBe("2.000");
  });

  it("should calculate stroke-width based on zoom", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(2);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("2.00000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("1.000");
    expect(document.body.dataset.zoom).toBe("2.00000");
    expect(document.body.dataset.strokeWidth).toBe("1.000");
  });

  it("should handle fractional zoom values", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(0.5);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("0.50000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("4.000");
    expect(document.body.dataset.zoom).toBe("0.50000");
    expect(document.body.dataset.strokeWidth).toBe("4.000");
  });

  it("should use custom canvas name", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1.5);

    applyCanvasState("custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["zoom", "current"], "custom-canvas");
    expect(document.body.style.getPropertyValue("--zoom")).toBe("1.50000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("1.333");
  });

  it("should format zoom with 5 decimal places", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1.123456789);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("1.12346");
    expect(document.body.dataset.zoom).toBe("1.12346");
  });

  it("should format stroke-width with 3 decimal places", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(1.333333);

    applyCanvasState();

    // 2 / 1.333333 = 1.500000... which rounds to 1.500
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("1.500");
    expect(document.body.dataset.strokeWidth).toBe("1.500");
  });

  it("should update existing values", () => {
    document.body.style.setProperty("--zoom", "0.50000");
    document.body.style.setProperty("--stroke-width", "4.000");
    document.body.dataset.zoom = "0.50000";
    document.body.dataset.strokeWidth = "4.000";

    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(2);

    applyCanvasState();

    expect(document.body.style.getPropertyValue("--zoom")).toBe("2.00000");
    expect(document.body.style.getPropertyValue("--stroke-width")).toBe("1.000");
    expect(document.body.dataset.zoom).toBe("2.00000");
    expect(document.body.dataset.strokeWidth).toBe("1.000");
  });
});
