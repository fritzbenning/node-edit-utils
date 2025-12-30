import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as disableCanvasTextModeModule from "../../canvas/disableCanvasTextMode";
import * as enableCanvasTextModeModule from "../../canvas/enableCanvasTextMode";
import * as setupNodeListenersModule from "./events/setupNodeListeners";
import * as handleTextChangeModule from "./helpers/handleTextChange";
import * as hasTextContentModule from "./helpers/hasTextContent";
import * as makeNodeEditableModule from "./helpers/makeNodeEditable";
import * as makeNodeNonEditableModule from "./helpers/makeNodeNonEditable";
import { nodeText } from "./nodeText";

vi.mock("../../canvas/disableCanvasTextMode");
vi.mock("../../canvas/enableCanvasTextMode");
vi.mock("./events/setupNodeListeners");
vi.mock("./helpers/handleTextChange");
vi.mock("./helpers/hasTextContent");
vi.mock("./helpers/makeNodeEditable");
vi.mock("./helpers/makeNodeNonEditable");

describe("nodeText", () => {
  let node: HTMLElement;
  let nodeProvider: HTMLElement;
  let cleanup: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    node = document.createElement("div");
    node.setAttribute("data-node-id", "test-node");
    node.textContent = "Test content";
    document.body.appendChild(node);

    nodeProvider = document.createElement("div");
    document.body.appendChild(nodeProvider);

    cleanup = vi.fn();

    vi.mocked(hasTextContentModule.hasTextContent).mockReturnValue(true);
    vi.mocked(setupNodeListenersModule.setupNodeListeners).mockReturnValue(cleanup);
    vi.mocked(makeNodeEditableModule.makeNodeEditable).mockImplementation(() => {});
    vi.mocked(makeNodeNonEditableModule.makeNodeNonEditable).mockImplementation(() => {});
    vi.mocked(enableCanvasTextModeModule.enableCanvasTextMode).mockImplementation(() => {});
    vi.mocked(disableCanvasTextModeModule.disableCanvasTextMode).mockImplementation(() => {});
    vi.mocked(handleTextChangeModule.handleTextChange).mockImplementation(() => {});
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

  it("should return NodeText interface", () => {
    const text = nodeText();

    expect(text).toHaveProperty("enableEditMode");
    expect(text).toHaveProperty("blurEditMode");
    expect(text).toHaveProperty("getEditableNode");
    expect(text).toHaveProperty("isEditing");
  });

  describe("enableEditMode", () => {
    it("should enable edit mode for node with text content", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);

      expect(hasTextContentModule.hasTextContent).toHaveBeenCalledWith(node);
      expect(makeNodeEditableModule.makeNodeEditable).toHaveBeenCalledWith(node);
      expect(enableCanvasTextModeModule.enableCanvasTextMode).toHaveBeenCalledWith("canvas");
      expect(setupNodeListenersModule.setupNodeListeners).toHaveBeenCalledWith(node, nodeProvider, expect.any(Function), "canvas");
    });

    it("should not enable edit mode for node without text content", () => {
      vi.mocked(hasTextContentModule.hasTextContent).mockReturnValue(false);
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);

      expect(makeNodeEditableModule.makeNodeEditable).not.toHaveBeenCalled();
      expect(enableCanvasTextModeModule.enableCanvasTextMode).not.toHaveBeenCalled();
    });

    it("should not enable edit mode if same node is already editable", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      text.enableEditMode(node, nodeProvider);

      expect(makeNodeEditableModule.makeNodeEditable).not.toHaveBeenCalled();
      expect(enableCanvasTextModeModule.enableCanvasTextMode).not.toHaveBeenCalled();
    });

    it("should blur previous node when enabling different node", () => {
      const text = nodeText();
      const node2 = document.createElement("div");
      node2.setAttribute("data-node-id", "test-node-2");
      node2.textContent = "Node 2 content";
      document.body.appendChild(node2);

      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      text.enableEditMode(node2, nodeProvider);

      expect(makeNodeNonEditableModule.makeNodeNonEditable).toHaveBeenCalledWith(node);
      expect(disableCanvasTextModeModule.disableCanvasTextMode).toHaveBeenCalledWith("canvas");
      expect(cleanup).toHaveBeenCalled();

      document.body.removeChild(node2);
    });

    it("should use custom canvas name", () => {
      const text = nodeText("custom-canvas");
      text.enableEditMode(node, nodeProvider);

      expect(enableCanvasTextModeModule.enableCanvasTextMode).toHaveBeenCalledWith("custom-canvas");
    });

    it("should handle null nodeProvider", () => {
      const text = nodeText();
      text.enableEditMode(node, null);

      expect(setupNodeListenersModule.setupNodeListeners).toHaveBeenCalledWith(node, null, expect.any(Function), "canvas");
    });
  });

  describe("blurEditMode", () => {
    it("should blur edit mode", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      text.blurEditMode();

      expect(handleTextChangeModule.handleTextChange).toHaveBeenCalledWith(node, [], true);
      expect(makeNodeNonEditableModule.makeNodeNonEditable).toHaveBeenCalledWith(node);
      expect(disableCanvasTextModeModule.disableCanvasTextMode).toHaveBeenCalledWith("canvas");
      expect(cleanup).toHaveBeenCalled();
    });

    it("should not blur if no node is editable", () => {
      const text = nodeText();

      text.blurEditMode();

      expect(handleTextChangeModule.handleTextChange).not.toHaveBeenCalled();
      expect(makeNodeNonEditableModule.makeNodeNonEditable).not.toHaveBeenCalled();
    });

    it("should not blur if blur is already in progress", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      // Start blur
      text.blurEditMode();
      vi.clearAllMocks();

      // Try to blur again while in progress
      text.blurEditMode();

      expect(handleTextChangeModule.handleTextChange).not.toHaveBeenCalled();
    });

    it("should use custom canvas name", () => {
      const text = nodeText("custom-canvas");
      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      text.blurEditMode();

      expect(disableCanvasTextModeModule.disableCanvasTextMode).toHaveBeenCalledWith("custom-canvas");
    });

    it("should handle cleanup being null", () => {
      vi.mocked(setupNodeListenersModule.setupNodeListeners).mockReturnValue(null as unknown as () => void);
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      vi.clearAllMocks();

      expect(() => {
        text.blurEditMode();
      }).not.toThrow();
    });
  });

  describe("getEditableNode", () => {
    it("should return null when no node is editable", () => {
      const text = nodeText();

      expect(text.getEditableNode()).toBeNull();
    });

    it("should return editable node", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);

      expect(text.getEditableNode()).toBe(node);
    });

    it("should return null after blur", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      text.blurEditMode();

      expect(text.getEditableNode()).toBeNull();
    });
  });

  describe("isEditing", () => {
    it("should return false when no node is editable", () => {
      const text = nodeText();

      expect(text.isEditing()).toBe(false);
    });

    it("should return true when node is editable", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);

      expect(text.isEditing()).toBe(true);
    });

    it("should return false after blur", () => {
      const text = nodeText();
      text.enableEditMode(node, nodeProvider);
      text.blurEditMode();

      expect(text.isEditing()).toBe(false);
    });
  });
});
