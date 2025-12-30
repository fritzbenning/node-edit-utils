import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createResizeHandle } from "./createResizeHandle";

describe("createResizeHandle", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create a resize handle element", () => {
    const handle = createResizeHandle(container);
    expect(handle).toBeInstanceOf(HTMLElement);
  });

  it("should have the resize-handle class", () => {
    const handle = createResizeHandle(container);
    expect(handle.classList.contains("resize-handle")).toBe(true);
  });

  it("should append handle to container", () => {
    const handle = createResizeHandle(container);
    expect(container.contains(handle)).toBe(true);
    expect(container.children).toContain(handle);
  });

  it("should return the created handle element", () => {
    const handle = createResizeHandle(container);
    const foundHandle = container.querySelector(".resize-handle");
    expect(handle).toBe(foundHandle);
  });
});
