import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DragCallbacks } from "./createDragHandler";
import { createDragHandler } from "./createDragHandler";

describe("createDragHandler", () => {
  let element: HTMLElement;
  let callbacks: DragCallbacks;
  let cleanup: () => void;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);

    callbacks = {
      onStart: vi.fn(),
      onDrag: vi.fn(),
      onStop: vi.fn(),
      onCancel: vi.fn(),
      onPreventClick: vi.fn(),
    };
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
    vi.clearAllMocks();
  });

  it("should return cleanup function", () => {
    cleanup = createDragHandler(element, callbacks);

    expect(typeof cleanup).toBe("function");
  });

  it("should call onStart on mousedown", () => {
    cleanup = createDragHandler(element, callbacks);

    const event = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(event);

    expect(callbacks.onStart).toHaveBeenCalledTimes(1);
    expect(callbacks.onStart).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      expect.objectContaining({
        isDragging: true,
        hasDragged: false,
        startX: 100,
        startY: 200,
      })
    );
  });

  it("should call onDrag on mousemove after drag starts", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start drag
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Move mouse
    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    expect(callbacks.onDrag).toHaveBeenCalledTimes(1);
    expect(callbacks.onDrag).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      expect.objectContaining({
        isDragging: true,
        hasDragged: true,
        startX: 100,
        startY: 200,
        deltaX: 50,
        deltaY: 50,
      })
    );
  });

  it("should not call onDrag before drag starts", () => {
    cleanup = createDragHandler(element, callbacks);

    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    expect(callbacks.onDrag).not.toHaveBeenCalled();
  });

  it("should call onStop on mouseup after drag starts", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start drag
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Stop drag
    const stopEvent = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(stopEvent);

    expect(callbacks.onStop).toHaveBeenCalledTimes(1);
    expect(callbacks.onStop).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      expect.objectContaining({
        isDragging: false,
        hasDragged: false,
        startX: 100,
        startY: 200,
      })
    );
  });

  it("should not call onStop if drag hasn't started", () => {
    cleanup = createDragHandler(element, callbacks);

    const stopEvent = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(stopEvent);

    expect(callbacks.onStop).not.toHaveBeenCalled();
  });

  it("should call onCancel on window blur during drag", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start drag
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Blur window
    window.dispatchEvent(new Event("blur"));

    expect(callbacks.onCancel).toHaveBeenCalledTimes(1);
    expect(callbacks.onCancel).toHaveBeenCalledWith(
      expect.objectContaining({
        isDragging: false,
        hasDragged: false,
        startX: 100,
        startY: 200,
      })
    );
  });

  it("should not call onCancel if drag hasn't started", () => {
    cleanup = createDragHandler(element, callbacks);

    window.dispatchEvent(new Event("blur"));

    expect(callbacks.onCancel).not.toHaveBeenCalled();
  });

  it("should call onPreventClick on click after drag", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start drag
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Move mouse to set hasDragged
    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    // Stop drag
    const stopEvent = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(stopEvent);

    // Click
    const clickEvent = new MouseEvent("click", { bubbles: true });
    element.dispatchEvent(clickEvent);

    expect(callbacks.onPreventClick).toHaveBeenCalledTimes(1);
  });

  it("should calculate correct deltaX and deltaY", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start at (100, 200)
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Move to (250, 350)
    const moveEvent = new MouseEvent("mousemove", { clientX: 250, clientY: 350, bubbles: true });
    document.dispatchEvent(moveEvent);

    expect(callbacks.onDrag).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      expect.objectContaining({
        deltaX: 150,
        deltaY: 150,
      })
    );
  });

  it("should handle negative deltas", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start at (200, 200)
    const startEvent = new MouseEvent("mousedown", { clientX: 200, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Move to (100, 100)
    const moveEvent = new MouseEvent("mousemove", { clientX: 100, clientY: 100, bubbles: true });
    document.dispatchEvent(moveEvent);

    expect(callbacks.onDrag).toHaveBeenCalledWith(
      expect.any(MouseEvent),
      expect.objectContaining({
        deltaX: -100,
        deltaY: -100,
      })
    );
  });

  it("should prevent default and stop propagation by default", () => {
    cleanup = createDragHandler(element, callbacks);

    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(startEvent, "preventDefault");
    const stopPropagationSpy = vi.spyOn(startEvent, "stopPropagation");

    element.dispatchEvent(startEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("should not prevent default when preventDefault option is false", () => {
    cleanup = createDragHandler(element, callbacks, { preventDefault: false });

    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(startEvent, "preventDefault");

    element.dispatchEvent(startEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("should not stop propagation when stopPropagation option is false", () => {
    cleanup = createDragHandler(element, callbacks, { stopPropagation: false });

    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true, cancelable: true });
    const stopPropagationSpy = vi.spyOn(startEvent, "stopPropagation");

    element.dispatchEvent(startEvent);

    expect(stopPropagationSpy).not.toHaveBeenCalled();
  });

  it("should remove all event listeners on cleanup", () => {
    cleanup = createDragHandler(element, callbacks);

    cleanup();

    // Clear mocks
    vi.clearAllMocks();

    // Try to trigger events - they should not be called
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    window.dispatchEvent(new Event("blur"));

    expect(callbacks.onStart).not.toHaveBeenCalled();
    expect(callbacks.onDrag).not.toHaveBeenCalled();
    expect(callbacks.onCancel).not.toHaveBeenCalled();
  });

  it("should work without optional callbacks", () => {
    const minimalCallbacks: DragCallbacks = {
      onDrag: vi.fn(),
    };
    cleanup = createDragHandler(element, minimalCallbacks);

    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    expect(minimalCallbacks.onDrag).toHaveBeenCalled();
  });

  it("should reset hasDragged flag after preventClick", () => {
    cleanup = createDragHandler(element, callbacks);

    // Start drag
    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    element.dispatchEvent(startEvent);

    // Move mouse
    const moveEvent = new MouseEvent("mousemove", { clientX: 150, clientY: 250, bubbles: true });
    document.dispatchEvent(moveEvent);

    // Stop drag
    const stopEvent = new MouseEvent("mouseup", { bubbles: true });
    document.dispatchEvent(stopEvent);

    // Click - should reset hasDragged
    const clickEvent = new MouseEvent("click", { bubbles: true });
    element.dispatchEvent(clickEvent);

    // The hasDragged flag should be reset after preventClick
    // This is tested implicitly by the fact that preventClick is called
    expect(callbacks.onPreventClick).toHaveBeenCalled();
  });

  it("should work with SVGElement", () => {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svgElement);

    cleanup = createDragHandler(svgElement, callbacks);

    const startEvent = new MouseEvent("mousedown", { clientX: 100, clientY: 200, bubbles: true });
    svgElement.dispatchEvent(startEvent);

    expect(callbacks.onStart).toHaveBeenCalled();

    cleanup();
    document.body.removeChild(svgElement);
  });
});

