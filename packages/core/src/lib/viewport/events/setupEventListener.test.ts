import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setupEventListener } from "./setupEventListener";

describe("setupEventListener", () => {
  let resizeHandle: HTMLElement;
  let startResize: ReturnType<typeof vi.fn>;
  let handleResize: ReturnType<typeof vi.fn>;
  let stopResize: ReturnType<typeof vi.fn>;
  let blurResize: ReturnType<typeof vi.fn>;
  let cleanup: () => void;

  beforeEach(() => {
    resizeHandle = document.createElement("div");
    document.body.appendChild(resizeHandle);

    startResize = vi.fn();
    handleResize = vi.fn();
    stopResize = vi.fn();
    blurResize = vi.fn();

    cleanup = setupEventListener(resizeHandle, startResize, handleResize, stopResize, blurResize);
  });

  afterEach(() => {
    cleanup();
    document.body.removeChild(resizeHandle);
    vi.clearAllMocks();
  });

  it("should call startResize on mousedown", () => {
    const event = new MouseEvent("mousedown", { bubbles: true });
    resizeHandle.dispatchEvent(event);

    expect(startResize).toHaveBeenCalledTimes(1);
    expect(startResize).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it("should call handleResize on mousemove", () => {
    const event = new MouseEvent("mousemove", { bubbles: true });
    document.dispatchEvent(event);

    expect(handleResize).toHaveBeenCalledTimes(1);
    expect(handleResize).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it("should call stopResize on mouseup", () => {
    const event = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(event);

    expect(stopResize).toHaveBeenCalledTimes(1);
    expect(stopResize).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it("should call blurResize on window blur", () => {
    const event = new Event("blur");
    window.dispatchEvent(event);

    expect(blurResize).toHaveBeenCalledTimes(1);
  });

  it("should call blurResize on mouseleave when leaving window", () => {
    const event = new MouseEvent("mouseleave", {
      bubbles: true,
      relatedTarget: null,
    });
    Object.defineProperty(event, "target", { value: document, writable: false });
    document.dispatchEvent(event);

    expect(blurResize).toHaveBeenCalledTimes(1);
  });

  it("should not call blurResize on mouseleave when relatedTarget exists", () => {
    const relatedTarget = document.createElement("div");
    const event = new MouseEvent("mouseleave", {
      bubbles: true,
      relatedTarget,
    });
    Object.defineProperty(event, "target", { value: document, writable: false });
    document.dispatchEvent(event);

    expect(blurResize).not.toHaveBeenCalled();
  });

  it("should remove all event listeners when cleanup is called", () => {
    cleanup();

    const mousedownEvent = new MouseEvent("mousedown", { bubbles: true });
    resizeHandle.dispatchEvent(mousedownEvent);
    expect(startResize).not.toHaveBeenCalled();

    const mousemoveEvent = new MouseEvent("mousemove", { bubbles: true });
    document.dispatchEvent(mousemoveEvent);
    expect(handleResize).not.toHaveBeenCalled();

    const mouseupEvent = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(mouseupEvent);
    expect(stopResize).not.toHaveBeenCalled();

    const blurEvent = new Event("blur");
    window.dispatchEvent(blurEvent);
    expect(blurResize).not.toHaveBeenCalled();
  });
});
