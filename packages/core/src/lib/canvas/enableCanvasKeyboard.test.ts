import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enableCanvasKeyboard } from "./enableCanvasKeyboard";
import * as getCanvasWindowValueModule from "./helpers/getCanvasWindowValue";

vi.mock("./helpers/getCanvasWindowValue");

describe("enableCanvasKeyboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call enable function from canvas window value", () => {
    const mockEnable = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockEnable);

    enableCanvasKeyboard();

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "enable"], "canvas");
    expect(mockEnable).toHaveBeenCalledTimes(1);
  });

  it("should use custom canvas name", () => {
    const mockEnable = vi.fn();
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(mockEnable);

    enableCanvasKeyboard("custom-canvas");

    expect(getCanvasWindowValueModule.getCanvasWindowValue).toHaveBeenCalledWith(["keyboard", "enable"], "custom-canvas");
    expect(mockEnable).toHaveBeenCalledTimes(1);
  });

  it("should not throw when enable function is undefined", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(undefined);

    expect(() => enableCanvasKeyboard()).not.toThrow();
  });

  it("should not throw when enable function is null", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue(null);

    expect(() => enableCanvasKeyboard()).not.toThrow();
  });

  it("should throw when getCanvasWindowValue returns non-function", () => {
    vi.mocked(getCanvasWindowValueModule.getCanvasWindowValue).mockReturnValue("not-a-function");

    expect(() => enableCanvasKeyboard()).toThrow();
  });
});
