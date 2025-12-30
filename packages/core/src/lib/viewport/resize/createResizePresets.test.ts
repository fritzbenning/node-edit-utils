import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RESIZE_PRESETS } from "../constants";
import { createResizePresets } from "./createResizePresets";

describe("createResizePresets", () => {
  let container: HTMLElement;
  let resizeHandle: HTMLElement;
  const mockUpdateWidth = vi.fn();

  beforeEach(() => {
    container = document.createElement("div");
    resizeHandle = document.createElement("div");
    container.appendChild(resizeHandle);
    document.body.appendChild(container);
    mockUpdateWidth.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create presets container", () => {
    const presets = createResizePresets(resizeHandle, container, mockUpdateWidth);
    expect(presets).toBeInstanceOf(HTMLElement);
    expect(presets.classList.contains("resize-presets")).toBe(true);
  });

  it("should append presets to resize handle", () => {
    const presets = createResizePresets(resizeHandle, container, mockUpdateWidth);
    expect(resizeHandle.contains(presets)).toBe(true);
  });

  it("should create buttons for all presets", () => {
    createResizePresets(resizeHandle, container, mockUpdateWidth);
    const buttons = resizeHandle.querySelectorAll(".resize-preset-button");
    expect(buttons).toHaveLength(RESIZE_PRESETS.length);
  });

  it("should set correct text content for each button", () => {
    createResizePresets(resizeHandle, container, mockUpdateWidth);
    const buttons = resizeHandle.querySelectorAll<HTMLButtonElement>(".resize-preset-button");
    RESIZE_PRESETS.forEach((preset, index) => {
      expect(buttons[index].textContent).toBe(preset.name);
    });
  });

  it("should call updateWidth with correct rawValue when button is clicked", () => {
    createResizePresets(resizeHandle, container, mockUpdateWidth);
    const buttons = resizeHandle.querySelectorAll<HTMLButtonElement>(".resize-preset-button");

    const firstPreset = RESIZE_PRESETS[0];
    buttons[0].click();

    expect(mockUpdateWidth).toHaveBeenCalledTimes(1);
    expect(mockUpdateWidth).toHaveBeenCalledWith(container, firstPreset.rawValue);
  });

  it("should handle clicks on all preset buttons", () => {
    createResizePresets(resizeHandle, container, mockUpdateWidth);
    const buttons = resizeHandle.querySelectorAll<HTMLButtonElement>(".resize-preset-button");

    buttons.forEach((button, index) => {
      button.click();
      expect(mockUpdateWidth).toHaveBeenCalledWith(container, RESIZE_PRESETS[index].rawValue);
    });

    expect(mockUpdateWidth).toHaveBeenCalledTimes(RESIZE_PRESETS.length);
  });

  it("should return the presets element", () => {
    const presets = createResizePresets(resizeHandle, container, mockUpdateWidth);
    const foundPresets = resizeHandle.querySelector(".resize-presets");
    expect(presets).toBe(foundPresets);
  });
});
