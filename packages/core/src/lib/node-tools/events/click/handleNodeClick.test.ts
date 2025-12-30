import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as clearHighlightFrameModule from "../../highlight/clearHighlightFrame";
import * as selectNodeModule from "../../select/selectNode";
import type { NodeText } from "../../text/types";
import { handleNodeClick } from "./handleNodeClick";

vi.mock("../../highlight/clearHighlightFrame");
vi.mock("../../select/selectNode");

describe("handleNodeClick", () => {
  let nodeProvider: HTMLElement;
  let node: HTMLElement;
  let mockText: NodeText;
  let onNodeSelected: ReturnType<typeof vi.fn>;
  let mockEvent: MouseEvent;

  beforeEach(() => {
    nodeProvider = document.createElement("div");
    nodeProvider.setAttribute("data-role", "node-provider");
    document.body.appendChild(nodeProvider);

    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    nodeProvider.appendChild(node);

    mockText = {
      getEditableNode: vi.fn(),
      enableEditMode: vi.fn(),
      blurEditMode: vi.fn(),
      isEditing: vi.fn(),
    };

    onNodeSelected = vi.fn();

    mockEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mockEvent, "target", { value: node, writable: false });

    vi.mocked(clearHighlightFrameModule.clearHighlightFrame).mockImplementation(() => {});
    vi.mocked(selectNodeModule.selectNode).mockReturnValue(node);
  });

  afterEach(() => {
    if (document.body.contains(nodeProvider)) {
      document.body.removeChild(nodeProvider);
    }
    vi.clearAllMocks();
  });

  it("should prevent default and stop propagation", () => {
    const preventDefaultSpy = vi.spyOn(mockEvent, "preventDefault");
    const stopPropagationSpy = vi.spyOn(mockEvent, "stopPropagation");

    handleNodeClick(mockEvent, nodeProvider, mockText, onNodeSelected);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("should clear highlight and call onNodeSelected with null when click is outside nodeProvider", () => {
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);
    const outsideEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(outsideEvent, "target", { value: outsideElement, writable: false, configurable: true });

    handleNodeClick(outsideEvent, nodeProvider, mockText, onNodeSelected);

    expect(clearHighlightFrameModule.clearHighlightFrame).toHaveBeenCalled();
    expect(onNodeSelected).toHaveBeenCalledWith(null);
    expect(selectNodeModule.selectNode).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it("should select node when click is inside nodeProvider", () => {
    handleNodeClick(mockEvent, nodeProvider, mockText, onNodeSelected);

    expect(selectNodeModule.selectNode).toHaveBeenCalledWith(mockEvent, nodeProvider, mockText);
    expect(onNodeSelected).toHaveBeenCalledWith(node);
  });

  it("should work with null nodeProvider", () => {
    handleNodeClick(mockEvent, null, mockText, onNodeSelected);

    expect(selectNodeModule.selectNode).toHaveBeenCalledWith(mockEvent, null, mockText);
  });

  it("should handle when selectNode returns null", () => {
    vi.mocked(selectNodeModule.selectNode).mockReturnValue(null);

    handleNodeClick(mockEvent, nodeProvider, mockText, onNodeSelected);

    expect(onNodeSelected).toHaveBeenCalledWith(null);
  });

  it("should handle when selectNode returns different node", () => {
    const node2 = document.createElement("div");
    vi.mocked(selectNodeModule.selectNode).mockReturnValue(node2);

    handleNodeClick(mockEvent, nodeProvider, mockText, onNodeSelected);

    expect(onNodeSelected).toHaveBeenCalledWith(node2);
  });
});
