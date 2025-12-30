import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DragState } from "../../helpers/createDragHandler";
import * as createDragHandlerModule from "../../helpers/createDragHandler";
import * as getNodeToolsModule from "../../helpers/getNodeTools";
import * as sendPostMessageModule from "../../post-message/sendPostMessage";
import * as getLabelPositionModule from "./helpers/getLabelPosition";
import * as getTransformValuesModule from "./helpers/getTransformValues";
import * as getZoomValueModule from "./helpers/getZoomValue";
import * as selectFirstViewportNodeModule from "./helpers/selectFirstViewportNode";
import * as setViewportDraggingModule from "./isViewportDragging";
import { setupViewportDrag } from "./setupViewportDrag";

vi.mock("../../helpers/createDragHandler");
vi.mock("../../helpers/getNodeTools");
vi.mock("../../post-message/sendPostMessage");
vi.mock("./helpers/getLabelPosition");
vi.mock("./helpers/getTransformValues");
vi.mock("./helpers/getZoomValue");
vi.mock("./helpers/selectFirstViewportNode");
vi.mock("./isViewportDragging");

describe("setupViewportDrag", () => {
  let labelElement: SVGTextElement;
  let labelGroup: SVGGElement;
  let viewportElement: HTMLElement;
  let mockCleanup: ReturnType<typeof vi.fn>;
  let mockNodeTools: {
    refreshHighlightFrame: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    labelElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelGroup.appendChild(labelElement);

    viewportElement = document.createElement("div");
    viewportElement.style.transform = "translate3d(100px, 200px, 0px)";
    document.body.appendChild(viewportElement);

    mockCleanup = vi.fn();
    mockNodeTools = {
      refreshHighlightFrame: vi.fn(),
    };

    vi.mocked(createDragHandlerModule.createDragHandler).mockReturnValue(mockCleanup);
    vi.mocked(getNodeToolsModule.getNodeTools).mockReturnValue(
      mockNodeTools as unknown as ReturnType<typeof getNodeToolsModule.getNodeTools>
    );
    vi.mocked(sendPostMessageModule.sendPostMessage).mockImplementation(() => {});
    vi.mocked(getLabelPositionModule.getLabelPosition).mockReturnValue({ x: 50, y: 100 });
    vi.mocked(getTransformValuesModule.getTransformValues).mockReturnValue({ x: 100, y: 200 });
    vi.mocked(getZoomValueModule.getZoomValue).mockReturnValue(1);
    vi.mocked(selectFirstViewportNodeModule.selectFirstViewportNode).mockImplementation(() => {});
    vi.mocked(setViewportDraggingModule.setViewportDragging).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.removeChild(viewportElement);
    vi.clearAllMocks();
  });

  it("should return cleanup function from createDragHandler", () => {
    const cleanup = setupViewportDrag(labelElement, viewportElement, "test-viewport");

    expect(cleanup).toBe(mockCleanup);
  });

  it("should set dragging to true on drag start", () => {
    let onStartCallback: ((event: MouseEvent, state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onStartCallback = callbacks.onStart;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mousedown");
    const mockState: DragState = { isDragging: true, hasDragged: false, startX: 0, startY: 0 };
    onStartCallback?.(mockEvent, mockState);

    expect(setViewportDraggingModule.setViewportDragging).toHaveBeenCalledWith(true);
  });

  it("should select first viewport node on drag start", () => {
    let onStartCallback: ((event: MouseEvent, state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onStartCallback = callbacks.onStart;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mousedown");
    const mockState: DragState = { isDragging: true, hasDragged: false, startX: 0, startY: 0 };
    onStartCallback?.(mockEvent, mockState);

    expect(selectFirstViewportNodeModule.selectFirstViewportNode).toHaveBeenCalledWith(viewportElement);
  });

  it("should update viewport and label positions during drag", () => {
    let onDragCallback: ((event: MouseEvent, state: DragState & { deltaX: number; deltaY: number }) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onDragCallback = callbacks.onDrag;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mousemove");
    const mockState: DragState & { deltaX: number; deltaY: number } = {
      isDragging: true,
      hasDragged: true,
      startX: 0,
      startY: 0,
      deltaX: 50,
      deltaY: 100,
    };
    onDragCallback?.(mockEvent, mockState);

    // Label position should use raw delta (screen space)
    expect(labelGroup.getAttribute("transform")).toBe("translate(100, 200)");
    // Viewport position should use zoom-adjusted delta (canvas space)
    expect(viewportElement.style.transform).toBe("translate3d(150px, 300px, 0)");
  });

  it("should account for zoom level during drag", () => {
    vi.mocked(getZoomValueModule.getZoomValue).mockReturnValue(2);

    let onDragCallback: ((event: MouseEvent, state: DragState & { deltaX: number; deltaY: number }) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onDragCallback = callbacks.onDrag;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mousemove");
    const mockState: DragState & { deltaX: number; deltaY: number } = {
      isDragging: true,
      hasDragged: true,
      startX: 0,
      startY: 0,
      deltaX: 100,
      deltaY: 200,
    };
    onDragCallback?.(mockEvent, mockState);

    // Delta should be divided by zoom (100/2 = 50, 200/2 = 100)
    expect(viewportElement.style.transform).toBe("translate3d(150px, 300px, 0)");
  });

  it("should set dragging to false and refresh highlight on drag stop with hasDragged", () => {
    let onStopCallback: ((event: MouseEvent, state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onStopCallback = callbacks.onStop;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mouseup");
    const mockState: DragState = { isDragging: false, hasDragged: true, startX: 0, startY: 0 };
    onStopCallback?.(mockEvent, mockState);

    expect(setViewportDraggingModule.setViewportDragging).toHaveBeenCalledWith(false);
    expect(mockNodeTools.refreshHighlightFrame).toHaveBeenCalled();
  });

  it("should send postMessage with final position on drag stop", () => {
    vi.mocked(getTransformValuesModule.getTransformValues).mockReturnValue({ x: 150, y: 250 });

    let onStopCallback: ((event: MouseEvent, state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onStopCallback = callbacks.onStop;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockEvent = new MouseEvent("mouseup");
    const mockState: DragState = { isDragging: false, hasDragged: true, startX: 0, startY: 0 };
    onStopCallback?.(mockEvent, mockState);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("viewport-position-changed", {
      viewportName: "test-viewport",
      x: 150,
      y: 250,
    });
  });

  it("should set dragging to false on cancel", () => {
    let onCancelCallback: ((state: DragState) => void) | undefined;

    vi.mocked(createDragHandlerModule.createDragHandler).mockImplementation((_element, callbacks) => {
      onCancelCallback = callbacks.onCancel;
      return mockCleanup;
    });

    setupViewportDrag(labelElement, viewportElement, "test-viewport");

    const mockState: DragState = { isDragging: false, hasDragged: false, startX: 0, startY: 0 };
    onCancelCallback?.(mockState);

    expect(setViewportDraggingModule.setViewportDragging).toHaveBeenCalledWith(false);
  });
});
