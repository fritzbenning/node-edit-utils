import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { disableCanvasKeyboard } from "./disableCanvasKeyboard";
import * as getCanvasWindowValueModule from "./helpers/getCanvasWindowValue";

vi.mock("./helpers/getCanvasWindowValue");

describe("disableCanvasKeyboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call disable function from canvas window value", () => {
    const mockDisable = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockDisable);

    disableCanvasKeyboard();

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "disable"], "canvas");
    expect(mockDisable).toHaveBeenCalledTimes(1);
  });

  it("should use custom canvas name", () => {
    const mockDisable = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockDisable);

    disableCanvasKeyboard("custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "disable"], "custom-canvas");
    expect(mockDisable).toHaveBeenCalledTimes(1);
  });

  it("should not throw when disable function is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    expect(() => disableCanvasKeyboard()).not.toThrow();
  });

  it("should not throw when disable function is null", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(null);

    expect(() => disableCanvasKeyboard()).not.toThrow();
  });

  it("should throw when getCanvasWindowValue returns non-function", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue("not-a-function");

    expect(() => disableCanvasKeyboard()).toThrow();
  });
});
