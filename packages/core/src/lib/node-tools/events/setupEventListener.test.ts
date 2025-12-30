import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as processPostMessageModule from "@/lib/post-message/processPostMessage";
import * as handleNodeClickModule from "./click/handleNodeClick";
import { setupEventListener } from "./setupEventListener";
import type { NodeText } from "../../text/types";

vi.mock("@/lib/post-message/processPostMessage");
vi.mock("./click/handleNodeClick");

describe("setupEventListener", () => {
  let nodeProvider: HTMLElement;
  let onNodeSelected: ReturnType<typeof vi.fn>;
  let onEscapePressed: ReturnType<typeof vi.fn>;
  let mockText: NodeText;
  let cleanup: () => void;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    onNodeSelected = vi.fn();
    onEscapePressed = vi.fn();
    mockText = {
      getEditableNode: vi.fn(),
      enableEditMode: vi.fn(),
      blurEditMode: vi.fn(),
      isEditing: vi.fn(),
    };

    vi.mocked(processPostMessageModule.processPostMessage).mockImplementation(() => {});
    vi.mocked(handleNodeClickModule.handleNodeClick).mockImplementation(() => {});
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return cleanup function", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    expect(typeof cleanup).toBe("function");
  });

  it("should setup message event listener", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    const event = new MessageEvent("message", {
      data: { source: "application", action: "selectedNodeChanged", data: "test" },
    });
    window.dispatchEvent(event);

    expect(processPostMessageModule.processPostMessage).toHaveBeenCalledWith(event, onNodeSelected);
  });

  it("should setup click event listener", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    const event = new MouseEvent("click", { bubbles: true });
    document.dispatchEvent(event);

    expect(handleNodeClickModule.handleNodeClick).toHaveBeenCalledWith(event, nodeProvider, mockText, onNodeSelected);
  });

  it("should setup keydown event listener for Escape key", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");
    const stopPropagationSpy = vi.spyOn(event, "stopPropagation");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(onEscapePressed).toHaveBeenCalled();
  });

  it("should not call onEscapePressed for other keys", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
    document.dispatchEvent(event);

    expect(onEscapePressed).not.toHaveBeenCalled();
  });

  it("should remove all event listeners on cleanup", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    cleanup();
    vi.clearAllMocks();

    const messageEvent = new MessageEvent("message", {
      data: { source: "application", action: "selectedNodeChanged", data: "test" },
    });
    window.dispatchEvent(messageEvent);

    const clickEvent = new MouseEvent("click", { bubbles: true });
    document.dispatchEvent(clickEvent);

    const keydownEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    document.dispatchEvent(keydownEvent);

    expect(processPostMessageModule.processPostMessage).not.toHaveBeenCalled();
    expect(handleNodeClickModule.handleNodeClick).not.toHaveBeenCalled();
    expect(onEscapePressed).not.toHaveBeenCalled();
  });

  it("should work with null nodeProvider", () => {
    cleanup = setupEventListener(null, onNodeSelected, onEscapePressed, mockText);

    const event = new MouseEvent("click", { bubbles: true });
    document.dispatchEvent(event);

    expect(handleNodeClickModule.handleNodeClick).toHaveBeenCalledWith(event, null, mockText, onNodeSelected);
  });

  it("should handle multiple escape presses", () => {
    cleanup = setupEventListener(nodeProvider, onNodeSelected, onEscapePressed, mockText);

    const event1 = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    const event2 = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    document.dispatchEvent(event1);
    document.dispatchEvent(event2);

    expect(onEscapePressed).toHaveBeenCalledTimes(2);
  });
});

