import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enableCanvasTextMode } from "./enableCanvasTextMode";
import * as getCanvasWindowValueModule from "./helpers/getCanvasWindowValue";

vi.mock("./helpers/getCanvasWindowValue");

describe("enableCanvasTextMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call enableTextEditMode function from canvas window value", () => {
    const mockEnableTextEditMode = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockEnableTextEditMode);

    enableCanvasTextMode();

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "enableTextEditMode"], "canvas");
    expect(mockEnableTextEditMode).toHaveBeenCalledTimes(1);
  });

  it("should use custom canvas name", () => {
    const mockEnableTextEditMode = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockEnableTextEditMode);

    enableCanvasTextMode("custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "enableTextEditMode"], "custom-canvas");
    expect(mockEnableTextEditMode).toHaveBeenCalledTimes(1);
  });

  it("should not throw when enableTextEditMode function is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    expect(() => enableCanvasTextMode()).not.toThrow();
  });

  it("should not throw when enableTextEditMode function is null", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(null);

    expect(() => enableCanvasTextMode()).not.toThrow();
  });

  it("should throw when getCanvasWindowValue returns non-function", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue("not-a-function");

    expect(() => enableCanvasTextMode()).toThrow();
  });
});
