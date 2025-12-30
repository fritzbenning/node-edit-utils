import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasContainerModule from "../canvas/helpers/getCanvasContainer";
import type { DragState } from "../helpers/createDragHandler";
import * as createDragHandlerModule from "../helpers/createDragHandler";
import * as getNodeProviderModule from "../helpers/getNodeProvider";
import * as getNodeToolsModule from "../helpers/getNodeTools";
import * as refreshHighlightFrameModule from "../node-tools/highlight/refreshHighlightFrame";
import { DEFAULT_WIDTH } from "./constants";
import { createViewport } from "./createViewport";
import * as refreshViewportLabelModule from "./label/refreshViewportLabel";
import * as removeViewportLabelModule from "./label/removeViewportLabel";
import * as createResizeHandleModule from "./resize/createResizeHandle";
import * as createResizePresetsModule from "./resize/createResizePresets";
import * as calcWidthModule from "./width/calcWidth";
import * as updateWidthModule from "./width/updateWidth";

vi.mock("../canvas/helpers/getCanvasContainer");
vi.mock("../helpers/createDragHandler");
vi.mock("../helpers/getNodeProvider");
vi.mock("../helpers/getNodeTools");
vi.mock("../node-tools/highlight/refreshHighlightFrame");
vi.mock("./label/refreshViewportLabel");
vi.mock("./label/removeViewportLabel");
vi.mock("./resize/createResizeHandle");
vi.mock("./resize/createResizePresets");
vi.mock("./width/calcWidth");
vi.mock("./width/updateWidth");

describe("createViewport", () => {
  let container: HTMLElement;
  let canvas: HTMLElement;
  let resizeHandle: HTMLElement;
  let mockDragCleanup: ReturnType<typeof vi.fn>;
  let mockNodeTools: {
    getSelectedNode: ReturnType<typeof vi.fn>;
  };
  let mockNodeProvider: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.classList.add("viewport");
    document.body.appendChild(container);

    canvas = document.createElement("div");
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");

    mockDragCleanup = vi.fn();
    mockNodeTools = {
      getSelectedNode: vi.fn().mockReturnValue(null),
    };
    mockNodeProvider = document.createElement("div");

    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(canvas);
    vi.mocked(createDragHandlerModule.createDragHandler).mockReturnValue(mockDragCleanup);
    vi.mocked(getNodeProviderModule.getNodeProvider).mockReturnValue(mockNodeProvider);
    vi.mocked(getNodeToolsModule.getNodeTools).mockReturnValue(
      mockNodeTools as unknown as ReturnType<typeof getNodeToolsModule.getNodeTools>
    );
    vi.mocked(refreshHighlightFrameModule.refreshHighlightFrame).mockImplementation(() => {});
    vi.mocked(refreshViewportLabelModule.refreshViewportLabel).mockImplementation(() => {});
    vi.mocked(removeViewportLabelModule.removeViewportLabel).mockImplementation(() => {});
    vi.mocked(createResizeHandleModule.createResizeHandle).mockReturnValue(resizeHandle);
    vi.mocked(createResizePresetsModule.createResizePresets).mockReturnValue(document.createElement("div"));
    vi.mocked(calcWidthModule.calcWidth).mockReturnValue(500);
    vi.mocked(updateWidthModule.updateWidth).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(canvas);
    vi.clearAllMocks();
  });

  it("should create viewport with default width", () => {
    const viewport = createViewport(container);

    expect(container.style.getPropertyValue("--container-width")).toBe(`${DEFAULT_WIDTH}px`);
    expect(viewport).toHaveProperty("setWidth");
    expect(viewport).toHaveProperty("cleanup");
  });

  it("should create viewport with initial width", () => {
    const initialWidth = 600;
    createViewport(container, initialWidth);

    expect(container.style.getPropertyValue("--container-width")).toBe(`${initialWidth}px`);
  });

  it("should remove existing resize handle before creating new one", () => {
    const existingHandle = document.createElement("div");
    existingHandle.classList.add("resize-handle");
    container.appendChild(existingHandle);

    createViewport(container);

    expect(container.querySelector(".resize-handle")).not.toBe(existingHandle);
  });

  it("should create resize handle", () => {
    createViewport(container);

    expect(createResizeHandleModule.createResizeHandle).toHaveBeenCalledWith(container);
  });

  it("should create resize presets", () => {
    createViewport(container);

    expect(createResizePresetsModule.createResizePresets).toHaveBeenCalledWith(resizeHandle, container, updateWidthModule.updateWidth);
  });

  it("should refresh viewport label on creation", () => {
    createViewport(container);

    expect(refreshViewportLabelModule.refreshViewportLabel).toHaveBeenCalledWith(container);
  });

  it("should set cursor to ew-resize during drag", () => {
    let onDragCallback: ((event: MouseEvent, state: DragState & { deltaX: number; deltaY: number }) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onDragCallback = callbacks.onDrag;
      return mockDragCleanup;
    });

    createViewport(container);

    const mockEvent = new MouseEvent("mousemove");
    const mockState: DragState & { deltaX: number; deltaY: number } = {
      isDragging: true,
      hasDragged: true,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
    };
    onDragCallback?.(mockEvent, mockState);

    expect(canvas.style.cursor).toBe("ew-resize");
  });

  it("should calculate and update width during drag", () => {
    let onDragCallback: ((event: MouseEvent, state: DragState & { deltaX: number; deltaY: number }) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onDragCallback = callbacks.onDrag;
      return mockDragCleanup;
    });

    createViewport(container);

    const mockEvent = new MouseEvent("mousemove");
    const mockState: DragState & { deltaX: number; deltaY: number } = {
      isDragging: true,
      hasDragged: true,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
    };
    onDragCallback?.(mockEvent, mockState);

    expect(calcWidthModule.calcWidth).toHaveBeenCalled();
    expect(updateWidthModule.updateWidth).toHaveBeenCalled();
  });

  it("should reset cursor to default on drag stop", () => {
    let onStopCallback: ((event: MouseEvent, state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onStopCallback = callbacks.onStop;
      return mockDragCleanup;
    });

    createViewport(container);
    canvas.style.cursor = "ew-resize";

    const mockEvent = new MouseEvent("mouseup");
    const mockState: DragState = { isDragging: false, hasDragged: false, startX: 0, startY: 0 };
    onStopCallback?.(mockEvent, mockState);

    expect(canvas.style.cursor).toBe("default");
  });

  it("should reset cursor to default on drag cancel", () => {
    let onCancelCallback: ((state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onCancelCallback = callbacks.onCancel;
      return mockDragCleanup;
    });

    createViewport(container);
    canvas.style.cursor = "ew-resize";

    const mockState: DragState = { isDragging: false, hasDragged: false, startX: 0, startY: 0 };
    onCancelCallback?.(mockState);

    expect(canvas.style.cursor).toBe("default");
  });

  it("should handle mouseleave when leaving window", () => {
    createViewport(container);
    canvas.style.cursor = "ew-resize";

    const event = new MouseEvent("mouseleave", {
      bubbles: true,
      relatedTarget: null,
    });
    Object.defineProperty(event, "target", { value: document, writable: false });
    document.dispatchEvent(event);

    expect(canvas.style.cursor).toBe("default");
  });

  it("should cleanup all listeners and remove handle on cleanup", () => {
    const viewport = createViewport(container);

    viewport.cleanup();

    expect(mockDragCleanup).toHaveBeenCalled();
    expect(removeViewportLabelModule.removeViewportLabel).toHaveBeenCalledWith(container);
    expect(container.querySelector(".resize-handle")).toBeNull();
  });

  it("should update width via setWidth", () => {
    const viewport = createViewport(container);
    const newWidth = 800;

    viewport.setWidth(newWidth);

    expect(updateWidthModule.updateWidth).toHaveBeenCalledWith(container, newWidth);
    expect(refreshViewportLabelModule.refreshViewportLabel).toHaveBeenCalledWith(container);
  });

  it("should refresh highlight frame when node is selected and setWidth is called", () => {
    const selectedNode = document.createElement("div");
    mockNodeTools.getSelectedNode.mockReturnValue(selectedNode);

    const viewport = createViewport(container);
    viewport.setWidth(800);

    expect(refreshHighlightFrameModule.refreshHighlightFrame).toHaveBeenCalledWith(selectedNode, mockNodeProvider);
  });

  it("should not refresh highlight frame when no node is selected", () => {
    mockNodeTools.getSelectedNode.mockReturnValue(null);

    const viewport = createViewport(container);
    viewport.setWidth(800);

    expect(refreshHighlightFrameModule.refreshHighlightFrame).not.toHaveBeenCalled();
  });

  it("should handle cleanup when canvas is null", () => {
    vi.mocked(getCanvasContainerModule.getCanvasContainer).mockReturnValue(null);

    const viewport = createViewport(container);

    expect(() => {
      viewport.cleanup();
    }).not.toThrow();
  });
});
