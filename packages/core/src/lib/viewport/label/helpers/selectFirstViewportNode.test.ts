import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as getNodeToolsModule from "../../../helpers/getNodeTools";
import * as sendPostMessageModule from "../../../post-message/sendPostMessage";
import { selectFirstViewportNode } from "./selectFirstViewportNode";

vi.mock("../../../helpers/getNodeTools");
vi.mock("../../../post-message/sendPostMessage");

describe("selectFirstViewportNode", () => {
  let viewportElement: HTMLElement;
  let firstChild: HTMLElement;
  let mockNodeTools: {
    selectNode: ReturnType<typeof vi.fn>;
    getSelectedNode: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    viewportElement = document.createElement("div");
    firstChild = document.createElement("div");
    firstChild.setAttribute("data-node-id", "test-node-1");
    viewportElement.appendChild(firstChild);
    document.body.appendChild(viewportElement);

    mockNodeTools = {
      selectNode: vi.fn(),
      getSelectedNode: vi.fn(),
    };

    vi.mocked(getNodeToolsModule.getNodeTools).mockReturnValue(mockNodeTools as any);
    vi.mocked(sendPostMessageModule.sendPostMessage).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.removeChild(viewportElement);
    vi.clearAllMocks();
  });

  it("should select first child node when nodeTools is available", () => {
    mockNodeTools.getSelectedNode.mockReturnValue(null);

    selectFirstViewportNode(viewportElement);

    expect(mockNodeTools.selectNode).toHaveBeenCalledWith(firstChild);
  });

  it("should skip resize-handle element", () => {
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    viewportElement.insertBefore(resizeHandle, firstChild);

    mockNodeTools.getSelectedNode.mockReturnValue(null);

    selectFirstViewportNode(viewportElement);

    expect(mockNodeTools.selectNode).toHaveBeenCalledWith(firstChild);
    expect(mockNodeTools.selectNode).not.toHaveBeenCalledWith(resizeHandle);
  });

  it("should send postMessage when node was already selected", () => {
    mockNodeTools.getSelectedNode.mockReturnValue(firstChild);

    selectFirstViewportNode(viewportElement);

    expect(mockNodeTools.selectNode).toHaveBeenCalledWith(firstChild);
    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("selectedNodeChanged", "test-node-1");
  });

  it("should not send postMessage when node was not already selected", () => {
    mockNodeTools.getSelectedNode.mockReturnValue(null);

    selectFirstViewportNode(viewportElement);

    expect(mockNodeTools.selectNode).toHaveBeenCalledWith(firstChild);
    expect(sendPostMessageModule.sendPostMessage).not.toHaveBeenCalled();
  });

  it("should do nothing when nodeTools is not available", () => {
    vi.mocked(getNodeToolsModule.getNodeTools).mockReturnValue(undefined);

    selectFirstViewportNode(viewportElement);

    expect(mockNodeTools.selectNode).not.toHaveBeenCalled();
  });

  it("should do nothing when there are no children", () => {
    const emptyViewport = document.createElement("div");
    document.body.appendChild(emptyViewport);

    selectFirstViewportNode(emptyViewport);

    expect(mockNodeTools.selectNode).not.toHaveBeenCalled();

    document.body.removeChild(emptyViewport);
  });

  it("should handle null data-node-id attribute", () => {
    firstChild.removeAttribute("data-node-id");
    mockNodeTools.getSelectedNode.mockReturnValue(firstChild);

    selectFirstViewportNode(viewportElement);

    expect(sendPostMessageModule.sendPostMessage).toHaveBeenCalledWith("selectedNodeChanged", null);
  });
});
