import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as connectResizeObserverModule from "../helpers/observer/connectResizeObserver";
import * as sendPostMessageModule from "../post-message/sendPostMessage";
import * as bindToWindowModule from "../window/bindToWindow";
import { createNodeTools } from "./createNodeTools";
import * as setupEventListenerModule from "./events/setupEventListener";
import * as clearHighlightFrameModule from "./highlight/clearHighlightFrame";
import * as highlightNodeModule from "./highlight/highlightNode";
import * as refreshHighlightFrameModule from "./highlight/refreshHighlightFrame";
import * as updateHighlightFrameVisibilityModule from "./highlight/updateHighlightFrameVisibility";
import * as nodeTextModule from "./text/nodeText";

vi.mock("../window/bindToWindow");
vi.mock("../post-message/sendPostMessage");
vi.mock("./events/setupEventListener");
vi.mock("./highlight/clearHighlightFrame");
vi.mock("./highlight/highlightNode");
vi.mock("./highlight/refreshHighlightFrame");
vi.mock("./highlight/updateHighlightFrameVisibility");
vi.mock("./text/nodeText");
vi.mock("../helpers/observer/connectResizeObserver");

// Mock ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

describe("createNodeTools", () => {
  let nodeProvider: HTMLElement;
  let node: HTMLElement;
  let mockText: {
    enableEditMode: ReturnType<typeof vi.fn>;
    blurEditMode: ReturnType<typeof vi.fn>;
    getEditableNode: ReturnType<typeof vi.fn>;
    isEditing: ReturnType<typeof vi.fn>;
  };
  let mockRemoveListeners: ReturnType<typeof vi.fn>;
  let mockResizeObserver: ResizeObserver;
  let mockMutationObserver: MutationObserver;
  let mockParentMutationObserver: MutationObserver;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node-1");
    nodeProvider.appendChild(node);

    mockText = {
      enableEditMode: vi.fn(),
      blurEditMode: vi.fn(),
      getEditableNode: vi.fn().mockReturnValue(null),
      isEditing: vi.fn().mockReturnValue(false),
    };

    mockRemoveListeners = vi.fn();
    mockResizeObserver = new ResizeObserver(() => {});
    mockResizeObserver.disconnect = vi.fn();
    mockMutationObserver = new MutationObserver(() => {});
    mockMutationObserver.disconnect = vi.fn();
    mockParentMutationObserver = new MutationObserver(() => {});
    mockParentMutationObserver.disconnect = vi.fn();

    vi.mocked(bindToWindowModule.bindToWindow).mockImplementation(() => {});
    vi.mocked(sendPostMessageModule.sendPostMessage).mockImplementation(() => {});
    vi.mocked(setupEventListenerModule.setupEventListener).mockReturnValue(mockRemoveListeners);
    vi.mocked(clearHighlightFrameModule.clearHighlightFrame).mockImplementation(() => {});
    vi.mocked(highlightNodeModule.highlightNode).mockImplementation(() => {});
    vi.mocked(refreshHighlightFrameModule.refreshHighlightFrame).mockImplementation(() => {});
    vi.mocked(updateHighlightFrameVisibilityModule.updateHighlightFrameVisibility).mockImplementation(() => {});
    vi.mocked(nodeTextModule.nodeText).mockReturnValue(mockText as unknown as ReturnType<typeof nodeTextModule.nodeText>);
    vi.mocked(connectResizeObserverModule.connectResizeObserver).mockReturnValue(mockResizeObserver);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return NodeTools interface", () => {
    const nodeTools = createNodeTools(nodeProvider);

    expect(nodeTools).toHaveProperty("selectNode");
    expect(nodeTools).toHaveProperty("getSelectedNode");
    expect(nodeTools).toHaveProperty("getEditableNode");
    expect(nodeTools).toHaveProperty("refreshHighlightFrame");
    expect(nodeTools).toHaveProperty("clearSelectedNode");
    expect(nodeTools).toHaveProperty("cleanup");
  });

  it("should bind nodeTools to window", () => {
    createNodeTools(nodeProvider);

    expect(bindToWindowModule.bindToWindow).toHaveBeenCalledWith("nodeTools", expect.any(Object));
  });

  it("should setup event listeners", () => {
    createNodeTools(nodeProvider);

    expect(setupEventListenerModule.setupEventListener).toHaveBeenCalledWith(
      nodeProvider,
      expect.any(Function),
      expect.any(Function),
      mockText
    );
  });

  it("should initialize with no selected node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    expect(nodeTools.getSelectedNode()).toBeNull();
  });

  it("should select a node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);

    expect(nodeTools.getSelectedNode()).toBe(node);
    expect(highlightNodeModule.highlightNode).toHaveBeenCalledWith(node);
    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("selectedNodeChanged", "test-node-1");
  });

  it("should not select same node twice", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    vi.clearAllMocks();

    nodeTools.selectNode(node);

    // Should not call highlightNode again
    expect(highlightNodeModule.highlightNode).not.toHaveBeenCalled();
  });

  it("should clear previous selection when selecting new node", () => {
    const nodeTools = createNodeTools(nodeProvider);
    const node2 = document.createElement("div");
    node2.setAttribute("data-node-id", "test-node-2");
    nodeProvider.appendChild(node2);

    nodeTools.selectNode(node);
    vi.clearAllMocks();

    nodeTools.selectNode(node2);

    expect(nodeTools.getSelectedNode()).toBe(node2);
    expect(mockResizeObserver.disconnect).toHaveBeenCalled();
  });

  it("should clear selection when selecting null", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    nodeTools.selectNode(null);

    expect(nodeTools.getSelectedNode()).toBeNull();
    expect(clearHighlightFrameModule.clearHighlightFrame).toHaveBeenCalled();
  });

  it("should blur edit mode when selecting different node", () => {
    const nodeTools = createNodeTools(nodeProvider);
    const node2 = document.createElement("div");
    node2.setAttribute("data-node-id", "test-node-2");
    nodeProvider.appendChild(node2);

    mockText.getEditableNode.mockReturnValue(node);
    mockText.isEditing.mockReturnValue(true);

    nodeTools.selectNode(node);
    vi.clearAllMocks();

    nodeTools.selectNode(node2);

    expect(mockText.blurEditMode).toHaveBeenCalled();
  });

  it("should not blur edit mode when selecting same editable node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    mockText.getEditableNode.mockReturnValue(node);
    mockText.isEditing.mockReturnValue(true);

    nodeTools.selectNode(node);
    vi.clearAllMocks();

    nodeTools.selectNode(node);

    expect(mockText.blurEditMode).not.toHaveBeenCalled();
  });

  it("should setup observers when selecting node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);

    expect(connectResizeObserverModule.connectResizeObserver).toHaveBeenCalled();
  });

  it("should handle escape key when editing", () => {
    const nodeTools = createNodeTools(nodeProvider);

    mockText.isEditing.mockReturnValue(true);
    nodeTools.selectNode(node);

    // Get the escape handler from setupEventListener
    const escapeHandler = vi.mocked(setupEventListenerModule.setupEventListener).mock.calls[0][2];
    escapeHandler();

    expect(mockText.blurEditMode).toHaveBeenCalled();
  });

  it("should handle escape key when node is selected", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);

    const escapeHandler = vi.mocked(setupEventListenerModule.setupEventListener).mock.calls[0][2];
    escapeHandler();

    expect(clearHighlightFrameModule.clearHighlightFrame).toHaveBeenCalled();
    expect(nodeTools.getSelectedNode()).toBeNull();
  });

  it("should handle escape key when no node is selected", () => {
    createNodeTools(nodeProvider);

    const escapeHandler = vi.mocked(setupEventListenerModule.setupEventListener).mock.calls[0][2];
    escapeHandler();

    expect(clearHighlightFrameModule.clearHighlightFrame).not.toHaveBeenCalled();
  });

  it("should refresh highlight frame", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    vi.clearAllMocks();

    nodeTools.refreshHighlightFrame();

    expect(refreshHighlightFrameModule.refreshHighlightFrame).toHaveBeenCalledWith(node, nodeProvider, "canvas");
    expect(updateHighlightFrameVisibilityModule.updateHighlightFrameVisibility).toHaveBeenCalledWith(node);
  });

  it("should not refresh highlight frame when no node is selected", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.refreshHighlightFrame();

    expect(refreshHighlightFrameModule.refreshHighlightFrame).not.toHaveBeenCalled();
  });

  it("should clear selected node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    nodeTools.clearSelectedNode();

    expect(nodeTools.getSelectedNode()).toBeNull();
    expect(clearHighlightFrameModule.clearHighlightFrame).toHaveBeenCalled();
  });

  it("should get editable node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    mockText.getEditableNode.mockReturnValue(node);

    expect(nodeTools.getEditableNode()).toBe(node);
  });

  it("should cleanup all resources", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    nodeTools.cleanup();

    expect(mockRemoveListeners).toHaveBeenCalled();
    expect(mockText.blurEditMode).toHaveBeenCalled();
    expect(clearHighlightFrameModule.clearHighlightFrame).toHaveBeenCalled();
    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("selectedNodeChanged", null);
  });

  it("should work with null nodeProvider", () => {
    const nodeTools = createNodeTools(null);

    expect(() => {
      nodeTools.selectNode(node);
    }).not.toThrow();
  });

  it("should handle node removal detection", async () => {
    const nodeTools = createNodeTools(nodeProvider);
    const testNode = document.createElement("div");
    testNode.setAttribute("data-node-id", "test-node-removal");
    nodeProvider.appendChild(testNode);

    nodeTools.selectNode(testNode);
    expect(nodeTools.getSelectedNode()).toBe(testNode);

    // Simulate node removal
    nodeProvider.removeChild(testNode);

    // Wait for mutation observer to process
    await new Promise((resolve) => setTimeout(resolve, 10));

    // The node should be cleared after removal
    // Note: The mutation observer should detect the removal and clear the selection
    expect(nodeTools.getSelectedNode()).toBeNull();
  });

  it("should use custom canvas name", () => {
    const nodeTools = createNodeTools(nodeProvider, "custom-canvas");

    nodeTools.selectNode(node);

    expect(nodeTextModule.nodeText).toHaveBeenCalledWith("custom-canvas");
  });

  it("should send postMessage with node ID when selecting", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("selectedNodeChanged", "test-node-1");
  });

  it("should send postMessage with null when clearing selection", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);
    nodeTools.selectNode(null);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenLastCalledWith("selectedNodeChanged", null);
  });

  it("should update highlight frame visibility when selecting node", () => {
    const nodeTools = createNodeTools(nodeProvider);

    nodeTools.selectNode(node);

    expect(updateHighlightFrameVisibilityModule.updateHighlightFrameVisibility).toHaveBeenCalledWith(node);
  });

  it("should handle multiple node selections", () => {
    const nodeTools = createNodeTools(nodeProvider);
    const node2 = document.createElement("div");
    node2.setAttribute("data-node-id", "test-node-2");
    nodeProvider.appendChild(node2);
    const node3 = document.createElement("div");
    node3.setAttribute("data-node-id", "test-node-3");
    nodeProvider.appendChild(node3);

    nodeTools.selectNode(node);
    expect(nodeTools.getSelectedNode()).toBe(node);

    nodeTools.selectNode(node2);
    expect(nodeTools.getSelectedNode()).toBe(node2);

    nodeTools.selectNode(node3);
    expect(nodeTools.getSelectedNode()).toBe(node3);

    nodeTools.selectNode(null);
    expect(nodeTools.getSelectedNode()).toBeNull();
  });
});
