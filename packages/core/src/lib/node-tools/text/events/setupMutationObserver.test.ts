import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as connectMutationObserverModule from "../../../helpers/observer/connectMutationObserver";
import * as refreshHighlightFrameModule from "../../highlight/refreshHighlightFrame";
import * as handleTextChangeModule from "../helpers/handleTextChange";
import { setupMutationObserver } from "./setupMutationObserver";

vi.mock("../../../helpers/observer/connectMutationObserver");
vi.mock("../../highlight/refreshHighlightFrame");
vi.mock("../helpers/handleTextChange");

describe("setupMutationObserver", () => {
  let node: HTMLElement;
  let nodeProvider: HTMLElement;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockObserver: { disconnect: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    node.textContent = "Initial text";
    document.body.appendChild(node);

    nodeProvider = document.createElement("div");
    document.body.appendChild(nodeProvider);

    mockDisconnect = vi.fn();
    mockObserver = { disconnect: mockDisconnect };

    vi.mocked(connectMutationObserverModule.connectMutationObserver).mockReturnValue(
      mockObserver as unknown as ReturnType<typeof connectMutationObserverModule.connectMutationObserver>
    );
    vi.mocked(refreshHighlightFrameModule.refreshHighlightFrame).mockImplementation(() => {});
    vi.mocked(handleTextChangeModule.handleTextChange).mockImplementation(() => {});

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 0);
      return 1;
    }) as unknown as typeof requestAnimationFrame;
    global.cancelAnimationFrame = vi.fn() as unknown as typeof cancelAnimationFrame;
  });

  afterEach(() => {
    if (document.body.contains(node)) {
      document.body.removeChild(node);
    }
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should return cleanup function", () => {
    const cleanup = setupMutationObserver(node, nodeProvider);

    expect(typeof cleanup).toBe("function");
  });

  it("should call connectMutationObserver", () => {
    setupMutationObserver(node, nodeProvider);

    expect(connectMutationObserverModule.connectMutationObserver).toHaveBeenCalledWith(
      node,
      expect.any(Function)
    );
  });

  it("should call refreshHighlightFrame on mutation", () => {
    setupMutationObserver(node, nodeProvider);

    const callback = vi.mocked(connectMutationObserverModule.connectMutationObserver).mock.calls[0][1];
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    callback(mutations);

    expect(refreshHighlightFrameModule.refreshHighlightFrame).toHaveBeenCalledWith(node, nodeProvider, "canvas");
  });

  it("should use custom canvas name", () => {
    setupMutationObserver(node, nodeProvider, "custom-canvas");

    const callback = vi.mocked(connectMutationObserverModule.connectMutationObserver).mock.calls[0][1];
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    callback(mutations);

    expect(refreshHighlightFrameModule.refreshHighlightFrame).toHaveBeenCalledWith(node, nodeProvider, "custom-canvas");
  });

  it("should accumulate mutations", async () => {
    setupMutationObserver(node, nodeProvider);

    const callback = vi.mocked(connectMutationObserverModule.connectMutationObserver).mock.calls[0][1];
    const mutations1: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];
    const mutations2: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    callback(mutations1);
    callback(mutations2);

    // Wait for RAF callbacks
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handleTextChangeModule.handleTextChange).toHaveBeenCalled();
  });

  it("should disconnect observer on cleanup", () => {
    const cleanup = setupMutationObserver(node, nodeProvider);

    cleanup();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should cancel pending animation frames on cleanup", () => {
    const cleanup = setupMutationObserver(node, nodeProvider);

    // Trigger a mutation to schedule RAF
    const callback = vi.mocked(connectMutationObserverModule.connectMutationObserver).mock.calls[0][1];
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];
    callback(mutations);

    cleanup();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should process mutations after double RAF", async () => {
    setupMutationObserver(node, nodeProvider);

    const callback = vi.mocked(connectMutationObserverModule.connectMutationObserver).mock.calls[0][1];
    const mutations: MutationRecord[] = [
      {
        type: "characterData",
        target: node.firstChild!,
        addedNodes: [] as NodeList,
        removedNodes: [] as NodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      } as MutationRecord,
    ];

    callback(mutations);

    // Wait for double RAF
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(handleTextChangeModule.handleTextChange).toHaveBeenCalledWith(node, mutations, false);
  });
});

