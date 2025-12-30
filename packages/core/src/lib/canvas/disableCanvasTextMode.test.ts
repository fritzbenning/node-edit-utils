import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { disableCanvasTextMode } from "./disableCanvasTextMode";
import * as getCanvasWindowValueModule from "./helpers/getCanvasWindowValue";

vi.mock("./helpers/getCanvasWindowValue");

describe("disableCanvasTextMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call disableTextEditMode function from canvas window value", () => {
    const mockDisableTextEditMode = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockDisableTextEditMode);

    disableCanvasTextMode();

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "disableTextEditMode"], "canvas");
    expect(mockDisableTextEditMode).toHaveBeenCalledTimes(1);
  });

  it("should use custom canvas name", () => {
    const mockDisableTextEditMode = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockDisableTextEditMode);

    disableCanvasTextMode("custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "disableTextEditMode"], "custom-canvas");
    expect(mockDisableTextEditMode).toHaveBeenCalledTimes(1);
  });

  it("should not throw when disableTextEditMode function is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    expect(() => disableCanvasTextMode()).not.toThrow();
  });

  it("should not throw when disableTextEditMode function is null", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(null);

    expect(() => disableCanvasTextMode()).not.toThrow();
  });

  it("should throw when getCanvasWindowValue returns non-function", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue("not-a-function");

    expect(() => disableCanvasTextMode()).toThrow();
  });
});
