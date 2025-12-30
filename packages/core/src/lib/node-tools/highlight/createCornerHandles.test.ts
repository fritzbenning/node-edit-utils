import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCornerHandles } from "./createCornerHandles";

describe("createCornerHandles", () => {
  let group: SVGGElement;

  beforeEach(() => {
    group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create four corner handles", () => {
    createCornerHandles(group, 200, 150);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    expect(handles.length).toBe(4);
  });

  it("should create top-left handle", () => {
    createCornerHandles(group, 200, 150);

    const handle = group.querySelector(".handle-top-left");
    expect(handle).not.toBeNull();
    expect(handle?.getAttribute("x")).toBe("-3");
    expect(handle?.getAttribute("y")).toBe("-3");
  });

  it("should create top-right handle", () => {
    createCornerHandles(group, 200, 150);

    const handle = group.querySelector(".handle-top-right");
    expect(handle).not.toBeNull();
    expect(handle?.getAttribute("x")).toBe("197");
    expect(handle?.getAttribute("y")).toBe("-3");
  });

  it("should create bottom-right handle", () => {
    createCornerHandles(group, 200, 150);

    const handle = group.querySelector(".handle-bottom-right");
    expect(handle).not.toBeNull();
    expect(handle?.getAttribute("x")).toBe("197");
    expect(handle?.getAttribute("y")).toBe("147");
  });

  it("should create bottom-left handle", () => {
    createCornerHandles(group, 200, 150);

    const handle = group.querySelector(".handle-bottom-left");
    expect(handle).not.toBeNull();
    expect(handle?.getAttribute("x")).toBe("-3");
    expect(handle?.getAttribute("y")).toBe("147");
  });

  it("should set handle size to 6", () => {
    createCornerHandles(group, 200, 150);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.getAttribute("width")).toBe("6");
      expect(handle.getAttribute("height")).toBe("6");
    });
  });

  it("should set vector-effect attribute", () => {
    createCornerHandles(group, 200, 150);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.getAttribute("vector-effect")).toBe("non-scaling-stroke");
    });
  });

  it("should apply instance color when isInstance is true", () => {
    // Mock getComputedStyle
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--component-color") return "rgb(255, 0, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    createCornerHandles(group, 200, 150, true, false);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.getAttribute("stroke")).toBe("rgb(255, 0, 0)");
    });

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should apply text edit color when isTextEdit is true", () => {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: vi.fn((prop: string) => {
        if (prop === "--text-edit-color") return "rgb(0, 255, 0)";
        return "";
      }),
    } as unknown as CSSStyleDeclaration);

    createCornerHandles(group, 200, 150, false, true);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.getAttribute("stroke")).toBe("rgb(0, 255, 0)");
    });

    window.getComputedStyle = originalGetComputedStyle;
  });

  it("should not set stroke when neither flag is true", () => {
    createCornerHandles(group, 200, 150, false, false);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.getAttribute("stroke")).toBeNull();
    });
  });

  it("should handle zero dimensions", () => {
    createCornerHandles(group, 0, 0);

    const topLeft = group.querySelector(".handle-top-left");
    expect(topLeft?.getAttribute("x")).toBe("-3");
    expect(topLeft?.getAttribute("y")).toBe("-3");
  });

  it("should handle very small dimensions", () => {
    createCornerHandles(group, 1, 1);

    const topRight = group.querySelector(".handle-top-right");
    expect(topRight?.getAttribute("x")).toBe("-2");
    expect(topRight?.getAttribute("y")).toBe("-3");
  });

  it("should append handles to group", () => {
    createCornerHandles(group, 200, 150);

    const handles = group.querySelectorAll(".highlight-frame-handle");
    handles.forEach((handle) => {
      expect(handle.parentNode).toBe(group);
    });
  });
});

