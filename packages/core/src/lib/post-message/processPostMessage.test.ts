import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as isLockedModule from "../node-tools/select/helpers/isLocked";
import { processPostMessage } from "./processPostMessage";

vi.mock("../node-tools/select/helpers/isLocked");

describe("processPostMessage", () => {
  let onNodeSelected: ReturnType<typeof vi.fn>;
  let node: HTMLElement;

  beforeEach(() => {
    onNodeSelected = vi.fn();
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node-123");
    document.body.appendChild(node);

    vi.mocked(isLockedModule.isLocked).mockReturnValue(false);
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    vi.clearAllMocks();
  });

  it("should call onNodeSelected with node when message is from application and action is selectedNodeChanged", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(onNodeSelected).toHaveBeenCalledTimes(1);
    expect(onNodeSelected).toHaveBeenCalledWith(node);
  });

  it("should not call onNodeSelected when source is not 'application'", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "other-source",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should not call onNodeSelected when action is not 'selectedNodeChanged'", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "otherAction",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should call onNodeSelected with null when node is locked", () => {
    vi.mocked(isLockedModule.isLocked).mockReturnValue(true);

    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(onNodeSelected).toHaveBeenCalledTimes(1);
    expect(onNodeSelected).toHaveBeenCalledWith(null);
  });

  it("should not call onNodeSelected when node is not found", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "non-existent-node",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should work without onNodeSelected callback", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    expect(() => {
      processPostMessage(event);
    }).not.toThrow();
  });

  it("should check if node is locked before calling callback", () => {
    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(isLockedModule.isLocked).toHaveBeenCalledWith(node);
  });

  it("should handle multiple nodes with different IDs", () => {
    const node2 = document.createElement("div");
    node2.setAttribute("data-node-id", "test-node-456");
    document.body.appendChild(node2);

    const event1 = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    const event2 = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-456",
      },
    });

    processPostMessage(event1, onNodeSelected);
    processPostMessage(event2, onNodeSelected);

    expect(onNodeSelected).toHaveBeenCalledTimes(2);
    expect(onNodeSelected).toHaveBeenNthCalledWith(1, node);
    expect(onNodeSelected).toHaveBeenNthCalledWith(2, node2);

    document.body.removeChild(node2);
  });

  it("should return early when node is locked", () => {
    vi.mocked(isLockedModule.isLocked).mockReturnValue(true);

    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    // Should only be called once with null, not with the node
    expect(onNodeSelected).toHaveBeenCalledTimes(1);
    expect(onNodeSelected).toHaveBeenCalledWith(null);
  });

  it("should handle event with missing data properties", () => {
    const event = new MessageEvent("message", {
      data: {},
    });

    expect(() => {
      processPostMessage(event, onNodeSelected);
    }).not.toThrow();

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should throw when event data is null", () => {
    const event = new MessageEvent("message", {
      data: null,
    });

    expect(() => {
      processPostMessage(event, onNodeSelected);
    }).toThrow();

    expect(onNodeSelected).not.toHaveBeenCalled();
  });

  it("should handle node that exists but is locked", () => {
    vi.mocked(isLockedModule.isLocked).mockReturnValue(true);

    const event = new MessageEvent("message", {
      data: {
        source: "application",
        action: "selectedNodeChanged",
        data: "test-node-123",
      },
    });

    processPostMessage(event, onNodeSelected);

    expect(isLockedModule.isLocked).toHaveBeenCalledWith(node);
    expect(onNodeSelected).toHaveBeenCalledWith(null);
  });
});
